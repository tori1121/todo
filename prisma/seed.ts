import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const user = {
  id: "1",
  singinId: "goshi",
  name: "torigoshi yuki",
};

async function main() {
  // ユーザーの作成
  await prisma.user.create({ data: user });
}

main();
