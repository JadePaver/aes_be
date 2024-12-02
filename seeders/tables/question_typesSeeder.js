import prisma from "../../src/prismaClient.js";

export async function questionTypesSeeder() {
  await prisma.questions_types.createMany({
    data: [
      { id: 1, name: "Multiple Choices" },
      { id: 2, name: "Fill-in the Blanks" },
      { id: 3, name: "Essay" },
      { id: 4, name: "Dropbox" },
    ],
  });
}
