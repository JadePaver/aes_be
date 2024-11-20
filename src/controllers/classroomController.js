import prisma from "../prismaClient.js";

export const assignUser = async (req, res) => {
  const { class_id } = req.params;
  const { id: user_id } = req.body;

  try {
    // Perform an upsert operation on the assigned_classroom table
    const parsedClassId = parseInt(class_id, 10);

    const updatedAssignment = await prisma.assigned_classroom.upsert({
      where: {
        user_id, // Ensure uniqueness by user_id
      },
      update: {
        class_id: parsedClassId, // Update the class_id if the user is already assigned
      },
      create: {
        user_id,
        class_id: parsedClassId,
      },
    });

    res.status(200).send({
      message: "User assigned successfully",
      data: updatedAssignment,
    });
  } catch (error) {
    console.error("Error assigning user:", error);
    res.status(500).send({
      message: "An error occurred while assigning the user",
      error: error.message,
    });
  }
};

export const transferStudents = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { id: currentClass_id } = req.body;

    // Transfer users with role_id = 2 from currentClass_id to class_id
    const transferred = await prisma.assigned_classroom.updateMany({
      where: {
        class_id: currentClass_id, // The current classroom ID
        user: { role_id: 2 }, // Only users with role_id = 2
      },
      data: {
        class_id: parseInt(class_id), // Set the new classroom ID
      },
    });

    res.status(200).json({
      message: `Successfully transferred ${transferred.count} students.`,
    });
  } catch (error) {
    console.error("Error transferring students:", error);
    res
      .status(500)
      .json({ error: "Failed to move students to the classroom." });
  }
};

export const addMember = async (req, res) => {
  try {
    const { user_code } = req.params;
    const { id: class_id } = req.body;

    console.log("params:", req.params);
    console.log("body:", req.body);
    console.log("class:", class_id);

    const archiveCodeRecord = await prisma.archive_codes.findUnique({
      where: { code: user_code },
      select: { user_id: true },
    });

    if (!archiveCodeRecord || !archiveCodeRecord.user_id) {
      return res.status(404).json({
        error: "User code not found or no associated user in the User Code.",
      });
    }

    const user_id = archiveCodeRecord.user_id;

    const existingAssignment = await prisma.assigned_classroom.findFirst({
      where: {
        user_id: user_id,
        class_id: class_id,
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "User is already assigned to this classroom." });
    }

    await prisma.assigned_classroom.upsert({
      where: {
        user_id: user_id,
      },
      update: {
        class_id: class_id,
      },
      create: {
        user_id: user_id,
        class_id: class_id,
      },
    });

    res.status(200).json({
      message: "User successfully moved or added to the classroom.",
    });
  } catch (error) {
    console.error("Error adding member:", error);
    res
      .status(500)
      .json({ error: "Failed to move or add user to the classroom." });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { user_id } = req.params;
    console.log("user_id_remove:", user_id);

    const updatedAssignment = await prisma.assigned_classroom.update({
      where: {
        user_id: parseInt(user_id),
      },
      data: {
        classroom: {
          disconnect: true, // This will remove the association with the classroom
        },
      },
    });

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(user_id),
      },
      select: {
        fName: true,
        lName: true,
      },
    });

    console.log("updatedAssignment:", updatedAssignment);
    res.send({
      message: `${user.fName} ${user.lName} unassigned from classroom successfully.`,
    });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ error: "Failed to remove member from classroom." });
  }
};

export const getClassMembers = async (req, res) => {
  try {
    const { class_id } = req.params;

    const classMembers = await prisma.users.findMany({
      where: {
        assigned_classroom: {
          some: {
            class_id: Number(class_id),
          },
        },
      },
      include: {
        role: true,
        archive_codes: true,
      },
    });
    res.json(classMembers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch classroom members" });
  }
};

export const updateClassroom = async (req, res) => {
  try {
    const { class_id } = req.params;
    const { name, grade, year, isRemoved } = req.body;

    const updatedClassroom = await prisma.classrooms.update({
      where: { id: Number(class_id) },
      data: {
        name,
        grade,
        year,
        isRemoved,
      },
    });

    res.json({
      message: "Classroom updated successfully",
      classroom: updatedClassroom,
    });
  } catch (error) {
    console.error("Error updating classroom:", error);
    res.status(500).json({ error: "Failed to update classroom" });
  }
};

export const getAllActive = async (req, res) => {
  try {
    const classrooms = await prisma.classrooms.findMany({
      where: {
        isRemoved: 0,
      },
      include: {
        _count: {
          select: {
            assignedClassroom: true,
          },
        },
      },
    });

    const result = classrooms.map((classroom) => ({
      ...classroom,
      totalUsers: classroom._count.assignedClassroom,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch classrooms" });
  }
};

export const removeClassroom = async (req, res) => {
  try {
    const { class_id } = req.params;

    const updatedClassroom = await prisma.classrooms.update({
      where: {
        id: parseInt(class_id),
      },
      data: {
        isRemoved: 1,
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

    const yearSuffix = year.toString().slice(-2);
    const randomCode = `${
      Math.floor(Math.random() * 900) + 100
    }${getRandomString()}-${getRandomString()}`;
    const classroomCode = `CL${yearSuffix}-${randomCode}`;

    const newClassroom = await prisma.classrooms.create({
      data: {
        name,
        grade,
        year: year,
        code: classroomCode,
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

function getRandomString() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
