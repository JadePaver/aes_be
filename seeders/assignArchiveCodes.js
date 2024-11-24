// assignArchiveCodes.js
import prisma from "../src/prismaClient.js";

export async function assignArchiveCodesToUsers() {
  // Fetch all users
  const users = await prisma.users.findMany();

  // Fetch available archive codes where user_id is null
  const archiveCodes = await prisma.archive_codes.findMany({
    where: { user_id: null },
    take: users.length, // Ensure we have enough archive codes
  });

  // Assign archive codes to users
  for (let i = 0; i < users.length; i++) {
    if (archiveCodes[i]) {
      await prisma.archive_codes.update({
        where: { code: archiveCodes[i].code },
        data: { user_id: users[i].id },
      });
    }
  }

  console.log("Archive codes assigned successfully.");
}
