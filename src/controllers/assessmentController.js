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

      res.send({ message: "assafasfasf" });
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

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif"];

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
