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

  //Insert Users
  // Seed users
  await prisma.users.createMany({
    data: [
      {
        id: 1,
        user_code: null,
        role_id: 5,
        fName: "Jade",
        lName: "Paver",
        mName: "Nuñez",
        ext_name: "II",
        birthDate: "2024-11-10T00:00:00.000Z",
        sex_id: 1,
        contact: "09203998306",
        email: "abc@gmail.com",
        username: "jade",
        password:
          "$2b$10$.jhdC6hs66Aq63ij6EzehO8MXStziByYsQjwQPhKIeijqxZ8t4j5O",
        isRemoved: 0,
        dateModified: "2024-11-10T05:29:14.000Z",
        dateCreated: "2024-11-10T05:26:20.000Z",
      },
      {
        id: 2,
        user_code: null,
        role_id: 5,
        fName: "John",
        lName: "Doe",
        mName: "Mern",
        ext_name: "Jr",
        birthDate: "2024-01-10T00:00:00.000Z",
        sex_id: 3,
        contact: "0123456789",
        email: "zzz@gmail.com",
        username: "root",
        password:
          "$2b$10$xrTH.nioG4b46EyVFaFO2eDp7qhAU0BEzXyHMqPTbNMOvX.QQsflW",
        isRemoved: 0,
        dateModified: "2024-11-10T05:29:14.000Z",
        dateCreated: "2024-11-10T05:26:20.000Z",
      },
    ],
    skipDuplicates: true,
  });

  // Insert archive codes
  await prisma.archive_codes.createMany({
    data: [
      { code: "CODE12345", user_id: null },
      { code: "CODE67890", user_id: null },
      { code: "CODEABCDE", user_id: null },
      { code: "CODEFGHIJ", user_id: null },
      { code: "CODEKLMNO", user_id: null },
    ],
  });

  // Assign archive codes to users
  const users = await prisma.users.findMany(); // Fetch all users
  const archiveCodes = await prisma.archive_codes.findMany({
    where: { user_id: null },
    take: users.length, // Ensure we have enough archive codes
  });

  for (let i = 0; i < users.length; i++) {
    if (archiveCodes[i]) {
      await prisma.archive_codes.update({
        where: { code: archiveCodes[i].code },
        data: { user_id: users[i].id },
      });
    }
  }

  //Insert Classrooms
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
