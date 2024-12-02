import prisma from "../prismaClient.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded images in the 'uploads/' directory
    cb(null, "../aes-be/uploads/assessments/");
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file to prevent overwriting
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName); // Use this unique name for the file
  },
});

// Multer instance for file-saving
const upload = multer({ storage });

export const uploadModule = async (req, res, next) => {
  upload.array("files")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: "Failed to upload files." });
    }
    try {
      const uploadedFiles = req.files;
      const newQuestions = req.newQuestions;

      const assessmentImagesData = uploadedFiles.map((file) => {
        const question = newQuestions.find(
          (question) =>
            question.file?.size === file.size &&
            question.file?.originalName === file.originalname
        );

        return {
          question_id: question ? question.id : null, // If a matching question is found, use its id, else null
          file: file.filename,
          label: file.originalname, // Ensure the label is the original name of the file
        };
      });

      await prisma.question_images.createMany({
        data: assessmentImagesData,
      });

      res.status(201).json({
        message: "Assessment has been created successfully",
      });
    } catch (error) {
      console.error("Error saving files:", error);
      res.status(500).json({ error: "Failed to save files to the database." });
    }
  });
};

export const create = async (req, res, next) => {
  try {
    const objectData = JSON.parse(decodeURIComponent(req.params.object_data));
    const {
      subject_id,
      name,
      description,
      allowLate,
      startDate,
      endDate,
      duration,
      questions,
    } = objectData;

    const { id: user_id } = req.user;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

    const subjectAssignedToUser = await prisma.assigned_subject.findFirst({
      where: {
        user_id: user_id,
        subject_id: parseInt(subject_id),
      },
    });

    if (!subjectAssignedToUser) {
      return res.status(400).json({
        error: "You're not assigned to the subject.",
      });
    }

    if (!questions || questions.length === 0) {
      return res.status(400).json({
        error: "Assessment can't have no questions.",
      });
    }

    //validate size and extensions of files
    for (const question of questions) {
      if (question.file) {
        if (question.file.size > MAX_FILE_SIZE) {
          return res.status(400).json({
            error: `File ${question.file.originalname} exceeds the 15MB limit.`,
            question: question,
          });
        }

        if (!ALLOWED_TYPES.includes(question.file.type)) {
          return res.status(400).json({
            error: `File ${question.file.originalname} has an invalid type. Only images is alloweds`,
            question: question,
          });
        }
      }
    }

    const assessmentData = {
      name: name,
      description: description,
      allowedLate: allowLate,
      duration: parseInt(duration),
      startDateTime: new Date(startDate),
      endDateTime: new Date(endDate),
      dateModified: new Date(),
    };

    // Check if an assessment with the same name already exists for the given subject_id
    const existingAssessment = await prisma.assessments.findFirst({
      where: {
        name: name,
        assignedAssessment: {
          some: {
            subject_id: parseInt(subject_id),
          },
        },
      },
    });

    if (existingAssessment) {
      return res.status(409).json({
        error: "Assessment with the same name already exists in this subject.",
      });
    }
    //Step1: create assessment
    const newAssessment = await prisma.assessments.create({
      data: assessmentData,
    });

    const assignedToSubject = await prisma.assigned_assessment.create({
      data: {
        subject_id: parseInt(subject_id),
        assessment_id: newAssessment.id,
      },
    });

    //Step2: create questions & it's choices
    req.newQuestions = await Promise.all(
      questions.map(async (question) => {
        const newQuestion = await prisma.questions.create({
          data: {
            assessment_id: newAssessment.id,
            label: question.label,
            points: question.points,
            type_id: question.type,
            upperCaseSensitive: question?.caseSensitive ? 1 : 0,
          },
        });

        newQuestion.file = question?.file;

        switch (question.type) {
          case 1: {
            question.choices.map(async (choice) => {
              await prisma.choices.create({
                data: {
                  question_id: newQuestion.id,
                  label: choice.label,
                  isCorrect: choice.isCorrect,
                },
              });
            });
            break;
          }
          case 2: {
            const newChoices = await prisma.choices.create({
              data: {
                question_id: newQuestion.id,
                label: question?.fill_ans ? question?.fill_ans : "",
                isCorrect: 1,
              },
            });
            break;
          }
          default: {
            break;
          }
        }
        return newQuestion;
      })
    );
    req.isValidated = true;

    next();
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).json({ error: "Failed to create assessments." });
  }
};

export const getAllAssigned = async (req, res, next) => {
  try {
    const { subject_id } = req.params;
    const { id: user_id } = req.user;

    // Check if the user is assigned to the subject
    const subjectAssigned = await prisma.assigned_subject.findFirst({
      where: {
        user_id: user_id,
        subject_id: parseInt(subject_id),
      },
    });

    if (!subjectAssigned) {
      return res.status(403).json({
        error: "You are not assigned to this subject.",
      });
    }

    // Fetch assessments and their questions
    const assignedAssessments = await prisma.assessments.findMany({
      where: {
        assignedAssessment: {
          some: {
            subject_id: parseInt(subject_id),
          },
        },
      },
      include: {
        questions: true,
      },
    });

    if (assignedAssessments.length === 0) {
      return res.status(404).json({
        error: "No assessments found for the given subject.",
      });
    }

    // Return the assessments with their questions
    return res.status(200).json(assignedAssessments);
  } catch (error) {
    console.error("Error in getAllAssigned:", error);
    return res.status(500).json({
      error: "Failed to fetch assessments.",
    });
  }
};

export const getByID = async (req, res, next) => {
  try {
    const { assessment_id } = req.params;

    // Fetch assessment along with questions and their choices
    const assessment = await prisma.assessments.findUnique({
      where: { id: parseInt(assessment_id) },
      include: {
        questions: {
          include: {
            type: {
              // Assuming there's a relationship to a `types` table
              select: {
                id: true,
                name: true, // Include type name (e.g., "Multiple Choice", "Short Answer")
              },
            },
            choices: {
              select: {
                id: true,
                label: true,
                question_id: true,
              },
            },
          },
        },
      },
    });

    if (!assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.status(200).json(assessment);
  } catch (error) {
    console.error("Error in getting assessment:", error);
    return res.status(500).json({
      error: "Failed to fetch assessment.",
    });
  }
};

export const startAssessment = async (req, res, next) => {
  try {
    const { assessment_id } = req.params;
    const { id: user_id } = req.user;

    const resultData = {
      assessment_id: parseInt(assessment_id),
      user_id: user_id,
    };

    const newResult = await prisma.assessment_results.create({
      data: resultData,
    });

    res.json({ message: "Assessment has Started" });
  } catch (error) {
    console.error("Error in starting assessment:", error);
    return res.status(500).json({
      error: "Failed to start assessment.",
    });
  }
};

export const findLastResult = async (req, res) => {
  try {
    const { assessment_id } = req.params;
    const { id: user_id } = req.user;

    const lastResult = await prisma.assessment_results.findFirst({
      where: {
        user_id: user_id,
        assessment_id: parseInt(assessment_id),
      },
      orderBy: { dateSubmitted: "desc" }, // Order by most recent
    });

    res.json(lastResult);
  } catch (error) {
    console.error("Error in fetching last assessment result:", error);
    return res.status(500).json({
      error: "Failed to fetchs last assessment resultt.",
    });
  }
};

export const recordResult = async (req, res, next) => {
  try {
    const { assessment_id } = req.params;
    const { id: user_id } = req.user;
    const {answers, assessmentResult} = req.body;

    // Step 2: Fetch questions and their choices for the assessment
    const keyAnswers = await prisma.questions.findMany({
      where: { assessment_id: parseInt(assessment_id) },
      include: {
        choices: true, // Include associated choices
      },
    });

    let totalPointsEarned = 0;
    let maxScore = 0;

    // Step 3: Process user answers using switch-case based on question type
    const userAnswersData = keyAnswers.map((question) => {
      const userAnswer = answers.find((a) => a.question_id === question.id);

      let isCorrect = 0;
      let pointsEarned = 0;

      switch (question.type_id) {
        case 1: // Multiple Choice
          const correctChoices = question.choices.filter(
            (choice) => choice.isCorrect === 1
          );

          const selectedChoice = question.choices.find(
            (choice) => choice.id === parseInt(userAnswer?.choice_id)
          );

          if (correctChoices.length > 0) {
            maxScore += question.points;

            if (
              selectedChoice &&
              correctChoices.some((choice) => choice.id === selectedChoice.id)
            ) {
              // Mark the answer as correct if the selected choice is among the correct ones
              isCorrect = 1;
              pointsEarned = question.points; // Use question's points for the correct answer
            }
          }
          break;

        case 2: // Fill-in-the-blank
          maxScore += question.points; // Add the question's points to the max score
          const correctChoice = question.choices.find(
            (choice) => choice.isCorrect === 1
          );

          if (correctChoice) {
            if (
              question.upperCaseSensitive
                ? userAnswer?.stringAnswer === correctChoice.label
                : userAnswer?.stringAnswer?.toLowerCase() ===
                  correctChoice.label.toLowerCase()
            ) {
              isCorrect = 1;
              pointsEarned = question.points; // Assign points for a correct answer
            }
          }
          break;

        case 3: // Essay
          maxScore += question.points; // Add the question's points to the max score
          pointsEarned = 0; // Grading logic for essays can be applied later
          break;

        default:
          console.warn(`Unknown question type: ${question.type_id}`);
          break;
      }

      totalPointsEarned += pointsEarned;
      return {
        assessment_result_id: assessmentResult.id,
        question_id: question.id,
        choice_id: parseInt(userAnswer?.choice_id) || null,
        string_ans: userAnswer?.stringAnswer || "",
        isCorrect: isCorrect,
        points_earned: pointsEarned,
      };
    });

    // console.log("userAnswersData:", userAnswersData);
    // console.log("Total Points Earned:", totalPointsEarned);
    // console.log("Max Score:", maxScore);

    const newUserAnswerResult = await prisma.user_answers.createMany({
      data: userAnswersData,
    });
    // console.log("newUserAnswerResult:", newUserAnswerResult);

    const updateAssessmentResult = await prisma.assessment_results.update({
      where: {
        id: assessmentResult.id,
      },
      data: {
        total_score: totalPointsEarned,
        max_score: maxScore,
        dateSubmitted: new Date(),
      },
    });

    res.json(userAnswersData);
  } catch (error) {
    console.error("Error in getting assessment:", error);
    return res.status(500).json({
      error: "Failed to fetch assessment.",
    });
  }
};
