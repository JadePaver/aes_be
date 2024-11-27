import prisma from "../../src/prismaClient.js";

export async function seedClassrooms() {
  await prisma.classrooms.createMany({
    data: [
      {
        code: "CL24-123ABCD-4567",
        name: "Meridia",
        grade: 1,
        year: 2024,
        isRemoved: 0,
      },
      {
        code: "CL24-K19ACV2-87YX",
        name: "Marfak",
        grade: 2,
        year: 2024,
        isRemoved: 0,
      },
      {
        code: "CL23-LKJ004J-KL72",
        name: "Andromeda",
        grade: 3,
        year: 2024,
        isRemoved: 0,
      },
      {
        code: "CL23-ASG450T-8JKH",
        name: "Earth",
        grade: 4,
        year: 2023,
        isRemoved: 0,
      },
    ],
  });
}
