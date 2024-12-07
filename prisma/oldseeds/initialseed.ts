 /*

async function main1() {
  Очистити таблицю перед сидінгом
  await prisma.service.deleteMany(); // Видаляє всі записи

  await prisma.service.createMany({
    data: [
      {
        name: 'Шини R14-R15',
        description: 'Шиномонтаж для легкових автомобілів з радіусом R14-R15.',
        price: 70,
        vehicleType: 'SMALL_CAR',
      },
      {
        name: 'Шини R16',
        description: 'Шиномонтаж для автомобілів з радіусом R16.',
        price: 90,
        vehicleType: 'SUV',
      },
      {
        name: 'Шини R17+',
        description: 'Шини преміум-класу або для позашляховиків.',
        price: 100,
        vehicleType: 'TRUCK',
      },
      {
        name: 'Утилізація старих шин',
        description: 'Послуга екологічної утилізації старих шин.',
        price: 5,
        vehicleType: null,
      },
      {
        name: 'Flat Run монтаж',
        description: 'Монтаж шин із жорсткими боковинами.',
        price: 25,
        vehicleType: null,
      },
      {
        name: 'Low Profile монтаж',
        description: 'Монтаж шин із низьким профілем.',
        price: 20,
        vehicleType: null,
      },
    ],
  });

  console.log('Сидінг завершено!');
}


main1()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


*/