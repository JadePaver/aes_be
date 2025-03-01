import prisma from "../../src/prismaClient.js";

export async function seedArchive() {
  await prisma.archive_codes.createMany({
    data: [
      { code: "CODE12345", user_id: null },
      { code: "CODE67890", user_id: null },
      { code: "CODEABCDE", user_id: null },
      { code: "CODEFGHIJ", user_id: null },
      { code: "CODEKLMNO", user_id: null },
      { code: "CODE37424", user_id: null },
    ],
  });
}
