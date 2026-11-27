function parseBoolean(value, name, defaultValue) {
  if (value === undefined) {
    return defaultValue;
  }

  if (/^(true|yes|1)$/i.test(value)) {
    return true;
  }

  if (/^(false|no|0)$/i.test(value)) {
    return false;
  }

  throw new Error(`Invalid ${name} value in DATABASE_URL.`);
}

function splitParameters(value) {
  const parameters = [];
  let current = "";
  let inBraces = false;

  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const equalsIndex = current.indexOf("=");

    if (
      character === "{" &&
      !inBraces &&
      equalsIndex >= 0 &&
      current.slice(equalsIndex + 1).trim() === ""
    ) {
      inBraces = true;
      current += character;
    } else if (character === "}" && inBraces) {
      if (value[index + 1] === "}") {
        current += "}}";
        index += 1;
      } else {
        inBraces = false;
        current += character;
      }
    } else if (character === ";" && !inBraces) {
      if (current.trim()) {
        parameters.push(current);
      }
      current = "";
    } else {
      current += character;
    }
  }

  if (inBraces) {
    throw new Error("Unclosed braced value in DATABASE_URL.");
  }

  if (current.trim()) {
    parameters.push(current);
  }

  return parameters;
}

function unbrace(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
    return trimmed.slice(1, -1).replace(/}}/g, "}").replace(/{{/g, "{");
  }
  return trimmed;
}

export function parseSqlServerConnectionString(connectionString) {
  if (typeof connectionString !== "string") {
    throw new Error("DATABASE_URL must contain a SQL Server connection string.");
  }

  const match =
    /^sqlserver:\/\/(\[[^\]]+\]|[^;:]+)(?::(\d+))?(?:;(.*))?$/i.exec(
      connectionString.trim(),
    );

  if (!match) {
    throw new Error("DATABASE_URL must use the sqlserver:// scheme.");
  }

  const values = new Map();
  for (const parameter of splitParameters(match[3] || "")) {
    const separator = parameter.indexOf("=");
    if (separator <= 0) {
      throw new Error("Invalid parameter in DATABASE_URL.");
    }
    values.set(
      parameter.slice(0, separator).trim().toLowerCase(),
      unbrace(parameter.slice(separator + 1)),
    );
  }

  const database = values.get("database") || values.get("initial catalog");
  const user = values.get("user") || values.get("username") || values.get("uid");
  const password = values.get("password") ?? values.get("pwd");

  if (!database || !user || password === undefined) {
    throw new Error(
      "DATABASE_URL must specify database, user, and password for SQL Server authentication.",
    );
  }

  const port = match[2] ? Number(match[2]) : undefined;
  if (port !== undefined && (!Number.isInteger(port) || port < 1 || port > 65535)) {
    throw new Error("DATABASE_URL contains an invalid SQL Server port.");
  }

  return {
    server: match[1].startsWith("[") ? match[1].slice(1, -1) : match[1],
    ...(port === undefined ? {} : { port }),
    database,
    user,
    password,
    options: {
      encrypt: parseBoolean(values.get("encrypt"), "encrypt", true),
      trustServerCertificate: parseBoolean(
        values.get("trustservercertificate"),
        "trustServerCertificate",
        false,
      ),
    },
  };
}
