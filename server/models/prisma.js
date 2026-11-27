import "dotenv/config";
import { PrismaMssql } from "@prisma/adapter-mssql";
import { PrismaClient } from "../generated/prisma/client.ts";
import { parseSqlServerConnectionString } from "./sql-server-connection.js";

const adapter = new PrismaMssql(
  parseSqlServerConnectionString(process.env.DATABASE_URL),
);

const prisma = new PrismaClient({ adapter });

export default prisma;