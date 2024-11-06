import prisma from "../src/prismaClient.js";

async function main() {
  // Insert predefined data for roles
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

  // Insert predefined data for sex_tbl
  await prisma.sex_tbl.createMany({
    data: [{ label: "Male" }, { label: "Female" }, { label: "Others" }],
    skipDuplicates: true,
  });

  // Insert archive_code
  await prisma.archive_code.createMany({
    data: [
      {
        code: "CODE12345",
        user_id: null, // Assuming user with ID 1 exists
      },
      {
        code: "CODE67890",
        user_id: null, // Assuming user with ID 2 exists
      },
      {
        code: "CODEABCDE",
        user_id: null, // Assuming user with ID 3 exists
      },
      {
        code: "CODEFGHIJ",
        user_id: null, // No user associated
      },
      {
        code: "CODEKLMNO",
        user_id: null, // No user associated
      },
    ],
  });
}

main()
  .then(() => {
    console.log("Seed data has been added successfully.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
