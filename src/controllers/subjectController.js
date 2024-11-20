import prisma from "../prismaClient.js";

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subjects.findMany({
      include: {
        classroom: {
          select: {
            name: true, // Only fetch the `name` of the classroom
          },
        },
      },
    });

    // Transform the response to include classroom name directly if needed
    const transformedSubjects = subjects.map((subject) => ({
      id: subject.id,
      code: subject.code,
      name: subject.name,
      year: subject.year,
      classroomName: subject.classroom?.name || null, // Add classroom name or null if not related
      isRemoved: subject.isRemoved,
      dateCreated: subject.dateCreated,
    }));

    console.log("subjects with classroom names:", transformedSubjects);

    res.json(transformedSubjects);
  } catch (error) {
    console.error("Error fetching subjects:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

export const createSubject = async (req, res) => {
  try {
    const { name, year, selectedClass } = req.body;

    // Validate the required fields
    if (!name || !year || !selectedClass || !selectedClass.id) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if the subject already exists
    const existingSubject = await prisma.subjects.findFirst({
      where: {
        name,
        year: year.toString(),
        class_id: selectedClass.id,
      },
    });

    if (existingSubject) {
      return res.status(409).json({
        error: "Subject with the same name, year, and class already exists.",
        existingSubject,
      });
    }

    // Create a unique subject code (can be customized)
    const subjectCode = `SUB-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 5)
      .toUpperCase()}`;

    // Create the subject in the database
    const newSubject = await prisma.subjects.create({
      data: {
        name,
        year: year.toString(),
        code: subjectCode,
        class_id: selectedClass.id,
      },
    });

    // Send the response
    res.status(201).json({
      message: "Subject created successfully.",
      subject: newSubject,
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma unique constraint error
      res
        .status(409)
        .json({ error: "Duplicate entry: Subject already exists." });
    } else {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Failed to create the subject." });
    }
  }
};
