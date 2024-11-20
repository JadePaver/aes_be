import prisma from "../../src/prismaClient.js";

export async function seedClassrooms() {
  await prisma.classrooms.createMany({
    data: [
      {
        code: "CL24-123ABCD-4567",
        name: "Meridia",
        grade: 10,
        year: 2024,
        isRemoved: 0,
      },
      {
        code: "CL24-K19ACV2-87YX",
        name: "Marfak",
        grade: 10,
        year: 2024,
        isRemoved: 0,
      },
      {
        code: "CL23-LKJ004J-KL72",
        name: "Andromeda",
        grade: 10,
        year: 2024,
        isRemoved: 0,
      },
    ],
  });
}
