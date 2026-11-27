import prisma from "./models/prisma.js";

async function probarConexion() {
  try {
    const conexion = await prisma.$queryRaw`
      SELECT
        DB_NAME() AS baseDeDatos,
        SUSER_SNAME() AS usuario
    `;

    console.table(conexion);

    const cantidad = await prisma.producto.count();

    console.log("Conexión correcta ✅");
    console.log(`Productos registrados: ${cantidad}`);
  } catch (error) {
    console.error("Error al conectar con la BD:", error.message);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

probarConexion();