import prisma from "../../src/prismaClient.js";

export async function seedRoles() {
  await prisma.roles.createMany({
    data: [
      { name: "Admin", code: "A" },
      { name: "Student", code: "ST" },
      { name: "Teacher", code: "TC" },
      { name: "Guardian", code: "GD" },
      { name: "Operator", code: "OP" },
    ],
    skipDuplicates: true, // Prevents duplicate entries if seed is run multiple times
  });
}
