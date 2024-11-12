import prisma from "../prismaClient.js";

export const getAllActive = async (req, res) => {
  try {
    const classrooms = await prisma.classrooms.findMany({
      where: {
        isRemoved: 0,
      },
    });
    res.json(classrooms);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};

export const removeClassroom = async (req, res) => {
  try {
    const { class_id } = req.params;

    // Update the 'isRemoved' field of the classroom
    const updatedClassroom = await prisma.classrooms.update({
      where: {
        id: parseInt(class_id), // Ensure class_id is a number
      },
      data: {
        isRemoved: 1, // Set the 'isRemoved' field to 1
      },
    });

    res.send({
      message: "Classroom removed successfully",
      classroom: updatedClassroom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to remove classroom" });
  }
};

export const createClassroom = async (req, res) => {
  try {
    const { name, grade, year } = req.body;

    // Check if a classroom with the same name, year, and grade already exists
    const existingClassroom = await prisma.classrooms.findFirst({
      where: {
        name: name,
        grade: grade,
        year: year,
      },
    });

    if (existingClassroom) {
      return res.status(400).json({
        error: "Classroom with the same name, grade, and year already exists",
      });
    }

    // Generate a classroom code
    const yearSuffix = year.toString().slice(-2); // Get last 2 digits of the year, e.g., "2024" -> "24"
    const randomCode = `${
      Math.floor(Math.random() * 900) + 100
    }${getRandomString()}-${getRandomString()}`;
    const classroomCode = `CL${yearSuffix}-${randomCode}`;

    // Create the new classroom
    const newClassroom = await prisma.classrooms.create({
      data: {
        name,
        grade,
        year: year,
        code: classroomCode, // Save the generated classroom code
      },
    });

    res.send({
      message: "Classroom created successfully",
      classroom: newClassroom,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create classroom" });
  }
};

// Helper function to generate a random alphanumeric string
function getRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
