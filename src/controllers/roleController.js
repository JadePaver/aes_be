import prisma from "../prismaClient.js";

export const getAllFilteredRoles = async (req, res) => {
  try {
    const roles = await prisma.roles.findMany({
      where: {
        id: {
            notIn: [1, 5],// Exclude roles with id 1
        },
        
      },
    }); // Use the correct model name 'users'
    res.json(roles);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch users" });
  }
};
