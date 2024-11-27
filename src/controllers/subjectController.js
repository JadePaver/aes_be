import prisma from "../prismaClient.js";

export const subjectDetails = async (req, res) => {
  try {
    const { subject_id } = req.params;

    // Fetch subject details, including related classroom and modules
    const subject = await prisma.subjects.findUnique({
      where: {
        id: parseInt(subject_id), // Convert subject_id to an integer
      },
      include: {
        classroom: true, // Include classroom details
        modules: true,   // Include related modules
      },
    });

    // Check if the subject exists
    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    res.status(200).json(subject);
  } catch (error) {
    console.error("Error fetching subject details:", error);
    res.status(500).json({ error: "Failed to fetch subject details." });
  }
};


export const getAssigned = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate the user_id
    if (!user_id) {
      return res.status(400).json({ error: "User ID is required." });
    }

    // Fetch subjects assigned to the user
    const assignedSubjects = await prisma.assigned_subject.findMany({
      where: {
        user_id: parseInt(user_id),
      },
      include: {
        subject: true, // Include subject details
      },
    });

    // If no subjects are found, return an appropriate response
    if (assignedSubjects.length === 0) {
      return res.status(404).json({ message: "No subjects found for this user." });
    }

    // Extract subject IDs
    const subjectIds = assignedSubjects.map((assignment) => assignment.subject_id);

    // Fetch users with role_id = 3 (instructors) assigned to these subjects
    const instructors = await prisma.assigned_subject.findMany({
      where: {
        subject_id: {
          in: subjectIds,
        },
        user: {
          role_id: 3, // Role ID for instructors
        },
      },
      include: {
        user: {
          select: {
            id: true,
            fName: true,
            lName: true,
            mName: true,
            ext_name: true,
            email: true,
            role: true, // Optional: to include role details
          },
        },
        subject: true, // Include subject details
      },
    });

    // Format the response
    const formattedSubjects = assignedSubjects.map((assignment) => {
      const subjectInstructors = instructors
        .filter((instructor) => instructor.subject_id === assignment.subject_id)
        .map((instructor) => instructor.user);

      return {
        ...assignment.subject,
        instructors: subjectInstructors,
      };
    });

    console.log("formattedSubjects:",formattedSubjects)
    res.status(200).json(formattedSubjects);
  } catch (error) {
    console.error("Error fetching assigned subjects:", error);
    res.status(500).json({ error: "Failed to fetch assigned subjects." });
  }
};



export const enrollUser = async (req, res) => {
  try {
    const { user_code } = req.params;
    const { id: subject_id, name: subject_name, year: subject_year } = req.body; // Extract subject_id from the request body
    // Find the user associated with the archive code
    const archiveCodeRecord = await prisma.archive_codes.findUnique({
      where: { code: user_code },
      select: { user_id: true },
    });

    // If no user found with the given archive code
    if (!archiveCodeRecord) {
      return res
        .status(404)
        .json({ error: "Invalid user code. User not found." });
    }

    const user_id = archiveCodeRecord.user_id;

    // Step 2: Retrieve the user's role
    const userRecord = await prisma.users.findUnique({
      where: { id: user_id },
      select: { role_id: true },
    });

    if (!userRecord) {
      return res.status(404).json({ error: "User record not found." });
    }

    // Step 3: If the user is a student (role_id = 2), check for duplicate subject enrollment
    if (userRecord.role_id === 2) {
      const existingEnrollment = await prisma.assigned_subject.findFirst({
        where: {
          user_id,
          subject: {
            name: subject_name,
            year: subject_year,
          },
        },
        include: {
          subject: {
            include: {
              classroom: true,
            },
          },
        },
      });

      if (existingEnrollment) {
        const classroomName =
          existingEnrollment?.subject?.classroom?.name || "Unknown";
        return res.status(400).json({
          error: `This student is already enrolled in the same subject name and year in classroom ${classroomName}.`,
        });
      }
    }

    // Check if the subject is already assigned to the user
    const existingAssignment = await prisma.assigned_subject.findUnique({
      where: {
        user_id_subject_id: { user_id, subject_id }, // Composite unique constraint
      },
    });

    if (existingAssignment) {
      return res
        .status(400)
        .json({ error: "Subject already assigned to this user." });
    }

    // Assign the subject to the user
    const newAssignment = await prisma.assigned_subject.create({
      data: {
        user_id,
        subject_id,
      },
    });

    return res.status(200).json({
      message: "Subject successfully assigned to user.",
      data: newAssignment,
    });
  } catch (error) {
    console.error("Error enrolling user:", error); // Log the error for debugging
    res.status(500).json({ error: "Failed to enroll user." });
  }
};

export const getMembers = async (req, res) => {
  try {
    const { subject_id } = req.params;

    // Fetch users assigned to the subject along with the date they were assigned
    const subjectMembers = await prisma.users.findMany({
      where: {
        assigned_subject: {
          some: {
            subject_id: Number(subject_id), // Ensure subject_id is a number
          },
        },
      },
      include: {
        role: true, // Include role details
        archive_codes: true, // Include archive codes
        assigned_subject: {
          where: {
            subject_id: Number(subject_id),
          },
          select: {
            dateCreated: true, // Include the date the subject was assigned
          },
        },
      },
    });

    // Transform the response to include dateAdded (dateCreated)
    const membersWithDate = subjectMembers.map((member) => ({
      id: member.id,
      fName: member.fName,
      mName: member.mName,
      lName: member.lName,
      ext_name: member.ext_name,
      email: member.email,
      contact: member.contact,
      role: member.role,
      archiveCodes: member.archive_codes,
      dateAdded: member.assigned_subject[0]?.dateCreated || null, // Get the dateCreated if available
    }));

    res.json(membersWithDate);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch subject members" });
  }
};

export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subjects.findMany({
      include: {
        classroom: true,
        assigned_subject: true,
      },
    });

    // Transform subjects to include the count of assigned users
    const subjectsWithUserCount = subjects.map((subject) => ({
      ...subject,
      assignedUserCount: subject.assigned_subject.length, // Count assigned users
    }));

    res.json(subjectsWithUserCount);
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

    // Fetch all users with role_id = 2 in the selected class
    const assignedUsers = await prisma.assigned_classroom.findMany({
      where: {
        class_id: selectedClass.id,
        user: {
          role_id: 2,
        },
      },
      include: {
        user: true, // Include user data
      },
    });

    // Create assigned_subject entries for all fetched users
    const assignedSubjectData = assignedUsers.map((assignedUser) => ({
      user_id: assignedUser.user_id,
      subject_id: newSubject.id,
    }));

    if (assignedSubjectData.length > 0) {
      await prisma.assigned_subject.createMany({
        data: assignedSubjectData,
      });
    }

    // Send the response
    res.status(201).json({
      message: `Subject created successfully and enrolled ${assignedSubjectData.length} student's.`,
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

export const enrollClassroom = async (req, res) => {
  try {
    const { subject_id } = req.params;
    const { id: classroom_id } = req.body;

    // Fetch the current `class_id` associated with the subject
    const subject = await prisma.subjects.findUnique({
      where: { id: parseInt(subject_id) },
      select: { class_id: true, name: true, year: true },
    });

    if (!subject) {
      return res.status(404).json({ error: "Subject not found." });
    }

    // Unassign users where `role_id = 2` and `assigned_classroom.class_id` matches the subject's `class_id`
    if (subject.class_id) {
      await prisma.assigned_subject.deleteMany({
        where: {
          subject_id: parseInt(subject_id),
          user: {
            assigned_classroom: {
              some: {
                class_id: subject.class_id,
              },
            },
            role_id: 2,
          },
        },
      });
    }

    // Fetch users to enroll where `role_id = 2` and `assigned_classroom.class_id` matches the new `classroom_id`
    const usersToEnroll = await prisma.assigned_classroom.findMany({
      where: {
        class_id: classroom_id,
        user: {
          role_id: 2,
        },
      },
      select: { user_id: true },
    });

    if (!usersToEnroll.length) {
      return res.status(404).json({
        error: "No eligible users found in the specified classroom.",
      });
    }

    // Prepare data for bulk insertion
    const assignedSubjectsData = usersToEnroll.map((user) => ({
      user_id: user.user_id,
      subject_id: parseInt(subject_id),
    }));

    // Bulk insert users into `assigned_subject`
    await prisma.assigned_subject.createMany({
      data: assignedSubjectsData,
      skipDuplicates: true, // Prevent duplicate entries
    });

    // Check if the new `class_id` would violate the unique constraint
    const existingSubject = await prisma.subjects.findFirst({
      where: {
        name: subject.name,
        year: subject.year,
        class_id: classroom_id,
      },
    });

    if (existingSubject) {
      // If there's a conflict with the `name`, `year`, and `class_id` combination, do not update
      return res.status(400).json({
        error: `Subject with the same name, year, and class_id already exists.`,
      });
    }

    // Only update the `class_id` if it's different from the current one and no conflict exists
    if (subject.class_id !== classroom_id) {
      // Update the `class_id` in the `subjects` table
      await prisma.subjects.update({
        where: { id: parseInt(subject_id) },
        data: { class_id: classroom_id },
      });
    }

    res.status(200).json({
      message: `${usersToEnroll.length} Students Enrolled successfully to the ${subject?.name} subject.`,
      enrolledUsers: usersToEnroll.length,
    });
  } catch (error) {
    console.error("Error during enrollment:", error);
    res.status(500).json({
      error: "Failed to process enrollment.",
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { user_id } = req.params; // Extract `user_id` from route parameters
    const { id: subject_id } = req.body; // Extract `subject_id` from request body

    console.log("params:", req.params);
    console.log("body:", req.body);
    // Ensure both user_id and subject_id are provided
    if (!user_id || !subject_id) {
      return res
        .status(400)
        .json({ error: "User ID and Subject ID are required." });
    }

    // Remove the assigned subject
    const removedEntry = await prisma.assigned_subject.deleteMany({
      where: {
        user_id: Number(user_id), // Ensure `user_id` is treated as a number
        subject_id: Number(subject_id), // Ensure `subject_id` is treated as a number
      },
    });

    console.log("removedEntry:", removedEntry);

    // Check if the entry was removed
    if (removedEntry.count === 0) {
      return res
        .status(404)
        .json({ error: "No matching record found to delete." });
    }

    res.status(200).json({ message: "Member removed successfully." });
  } catch (error) {
    console.error("Error during member removal:", error);
    res.status(500).json({
      error: "Failed to remove member.",
    });
  }
};
