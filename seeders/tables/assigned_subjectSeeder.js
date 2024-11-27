import prisma from "../../src/prismaClient.js";

export async function assignedSubjectsSeeder() {
  await prisma.assigned_subject.createMany({
    data: [
      {
        user_id: 1,
        subject_id: 1,
      },
      {
        user_id: 2,
        subject_id: 2,
      },
      {
        user_id: 3,
        subject_id: 3,
      },
      {
        user_id: 4,
        subject_id: 4,
      },
      {
        user_id: 5,
        subject_id: 5,
      },
    ],
  });
}
