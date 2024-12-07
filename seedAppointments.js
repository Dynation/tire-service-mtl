const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Видалити старі записи для уникнення конфліктів
  await prisma.appointment.deleteMany();

  // Отримати всіх користувачів із їхніми транспортними засобами
  const usersWithVehicles = await prisma.user.findMany({
    include: {
      vehicles: true,
    },
  });

  const date = '2024-12-13';
  let baseTime = new Date(`${date}T09:00:00Z`); // Початковий час для записів

  let appointmentData = [];

  for (const user of usersWithVehicles) {
    for (const vehicle of user.vehicles) {
      appointmentData.push({
        userId: user.id,
        vehicleId: vehicle.id,
        dateTime: new Date(baseTime),
        type: 'TIRE',
        status: 'PENDING',
        notes: `Appointment for ${vehicle.model} (${vehicle.plateNumber})`,
      });
      // Збільшуємо час на 1 годину для наступного запису
      baseTime = new Date(baseTime.getTime() + 60 * 60 * 1000);
    }
  }

  // Додаємо записи до бази даних
  await prisma.appointment.createMany({
    data: appointmentData,
  });

  console.log('Appointments have been seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
