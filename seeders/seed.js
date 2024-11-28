import prisma from "../src/prismaClient.js";
import { seedRoles } from "./tables/roles.js";
import { seedSex } from "./tables/sex.js";
import { seedUsers } from "./tables/users.js";
import { seedArchive } from "./tables/archive_codes.js";
import { seedClassrooms } from "./tables/classrooms.js";
import { assignArchiveCodesToUsers } from "./assignArchiveCodes.js";
import { assignedClassroomSeeder } from "./tables/assigned_classroomSeeder.js";
import { subjectsSeeder } from "./tables/subjectSeeder.js";
import { assignedSubjectsSeeder } from "./tables/assigned_subjectSeeder.js";
import { questionTypesSeeder } from "./tables/question_typesSeeder.js";

async function main() {
  // Insert predefined data for roles
  await seedRoles();
  console.log("Roles seeded successfully.");

  // Insert predefined data for sex_tbl
  await seedSex();
  console.log("Sex seeded successfully.");

  //Insert Users
  // Seed users
  await seedUsers();
  console.log("Users seeded successfully.");

  // Insert archive codes
  await seedArchive();
  console.log("Archive Codes seeded successfully.");

  // Assign archive codes to users
  await assignArchiveCodesToUsers();
  console.log("Archive codes assigned successfully.");

  //Insert Classrooms
  await seedClassrooms();
  console.log("Classroom seeded successfully.");

  await assignedClassroomSeeder();
  console.log("assignedClassroom seeded successfully.");
  
  await subjectsSeeder();
  console.log("subjects seeded successfully.");

  await assignedSubjectsSeeder();
  console.log("assignedSubjects seeded successfully.");

  await questionTypesSeeder();
  console.log("questionTypes seeded successfully.");
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
