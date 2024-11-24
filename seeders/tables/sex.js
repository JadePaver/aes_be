import prisma from "../../src/prismaClient.js";

export async function seedSex() {
  await prisma.sex_tbl.createMany({
    data: [{ label: "Male" }, { label: "Female" }, { label: "Others" }],
    skipDuplicates: true,
  });
}
