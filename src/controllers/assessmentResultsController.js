import prisma from "../prismaClient.js";
import path from "path";
import fs from "fs";

export const viewResult = async (req, res) => {
  try {
    const { assessment_id } = req.params;
    const { id: user_id } = req.user;

    const result = await prisma.assessment_results.findFirst({
      where: {
        assessment_id: parseInt(assessment_id),
        user_id,
      },
      include: {
        assessment: {
          include: {
            questions: {
              include: {
                choices: true,
                type: true,
                question_images: true,
              },
            },
          },
        },
        user_answers: {
          include: {
            choice: true,
          },
        },
      },
    });

    result.assessment.questions = result.assessment.questions.map(
      (question) => {
        const transformedFiles = question.question_images.map((file) => {
          const filePath = path.resolve("uploads/assessments", file.file);

          if (!fs.existsSync(filePath)) {
            console.error("File not found:", filePath);
            return {
              ...file,
              error: "File not found",
            };
          }

          const fileBuffer = fs.readFileSync(filePath);
          const fileBase64 = fileBuffer.toString("base64");

          return {
            ...file,
            fileBase64,
            fileUrl: `/uploads/assessments/${file.file}`,
          };
        });

        return {
          ...question,
          question_images: transformedFiles,
        };
      }
    );

    if (!result) {
      return res.status(404).json({ message: "Assessment result not found" });
    }

    res.json(result);
  } catch (error) {
    console.error("Error getting user assessment result:", error);
    res.status(500).send({
      message: "An error occurred while assigning the user",
      error: error.message,
    });
  }
};
