const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Seed de MS Multisucursal ejecutado correctamente.');
  console.log('No hay datos semilla predeterminados — las asignaciones se crean vía API.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Error ejecutando seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
