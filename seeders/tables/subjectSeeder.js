import prisma from "../../src/prismaClient.js";

export async function subjectsSeeder() {
  await prisma.subjects.createMany({
    data: [
      {
        code: "MATH101",
        name: "Basic Mathematics",
        year: "2024", // Adjust as needed
        class_id: 1, // Replace with actual classroom IDs
      },
      {
        code: "SCI102",
        name: "General Science",
        year: "2024",
        class_id: 2,
      },
      {
        code: "ENG103",
        name: "English Literature",
        year: "2024",
        class_id: 3,
      },
      {
        code: "HIST104",
        name: "World History",
        year: "2024",
        class_id: 4,
      },
      {
        code: "COMP105",
        name: "Computer Science",
        year: "2024",
        class_id: 4,
      },
    ],
    skipDuplicates: true, 
  });
}
