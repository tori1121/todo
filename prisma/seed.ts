import { PrismaClient, Status } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const section1 = await prisma.section.create({
    data: {
      name: " 家事・生活",
    },
  });

  const section2 = await prisma.section.create({
    data: {
      name: "キャリア",
    },
  });

  const section3 = await prisma.section.create({
    data: {
      name: "その他",
    },
  });

  const user1 = await prisma.user.create({
    data: {
      singinId: "user1@example.com",
      name: "User1",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      singinId: "user2@example.com",
      name: "User2",
    },
  });

  const task1 = await prisma.task.create({
    data: {
      title: "役所へ行く",
      description: "国民年金の調整",
      details: "Detailed information about task 1",
      endDate: new Date("2025-03-28T00:00:00Z"),
      status: Status.TODO,
      userId: user1.id,
      sectionId: section1.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: "書籍を読む",
      description: "",
      details: "Detailed information about task 2",
      endDate: new Date("2025-03-31T00:00:00Z"),
      status: Status.DOING,
      userId: user1.id,
      sectionId: section1.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: "プログラミング",
      description: "デプロイまで",
      details: "Detailed information about task 3",
      endDate: new Date("2025-04-07T00:00:00Z"),
      status: Status.DONE,
      userId: user1.id,
      sectionId: section2.id,
    },
  });

  const task4 = await prisma.task.create({
    data: {
      title: "ワークショップ",
      description: "議題：○○",
      details: "Detailed information about task 4",
      endDate: new Date("2025-04-10T00:00:00Z"),
      status: Status.TODO,
      userId: user1.id,
      sectionId: section2.id,
    },
  });

  const task5 = await prisma.task.create({
    data: {
      title: "健康診断",
      description: "住所：○○",
      details: "Detailed information about task 5",
      endDate: new Date("2025-04-04T00:00:00Z"),
      status: Status.TODO,
      userId: user1.id,
      sectionId: section1.id,
    },
  });

  const task6 = await prisma.task.create({
    data: {
      title: "結婚式",
      description: "友人代表スピーチ",
      details: "Detailed information about task 6",
      endDate: new Date("2025-03-29T00:00:00Z"),
      status: Status.TODO,
      userId: user1.id,
      sectionId: section3.id,
    },
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
