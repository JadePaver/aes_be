import prisma from "../../src/prismaClient.js";

export async function seedUsers() {
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
}
