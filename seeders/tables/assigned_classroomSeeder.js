import prisma from "../../src/prismaClient.js";

export async function assignedClassroomSeeder() {
  await prisma.assigned_classroom.createMany({
    data: [
      {
        user_id: 1, // Replace with actual user IDs
        class_id: 1, // Replace with actual class IDs
      },
      {
        user_id: 2,
        class_id: 2,
      },
      {
        user_id: 3,
        class_id: 2,
      },
      {
        user_id: 4,
        class_id: 3,
      },
      {
        user_id: 5,
        class_id: 1,
      },
    ],
    skipDuplicates: true,
  });
}
