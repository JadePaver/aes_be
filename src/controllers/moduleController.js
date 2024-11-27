import prisma from "../prismaClient.js";
import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded images in the 'uploads/' directory
    cb(null, "../aes-be/uploads/modules/");
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

    const objectData = JSON.parse(decodeURIComponent(req.params.object_data));
    const { subject_id } = objectData;
    const uploadedFiles = req.files;
    const newModule = req.newModule;

    try {
      // Loop through each uploaded file and save the file information in the database
      const moduleFilesData = uploadedFiles.map((file) => ({
        module_id: newModule.id,
        file: file.filename,
        label: file.originalname, // Ensure the label is the original name of the file
      }));

      // Insert all the file data into the module_files table
      await prisma.module_files.createMany({
        data: moduleFilesData,
      });

      // Proceed to the next middleware
      res.status(201).json({
        message: "Module created and files uploaded successfully",
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
    const { uploadFiles, name, description, postingDate } = objectData;

    const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
    const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB

    const ALLOWED_TYPES = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    let totalSize = 0;
    for (const file of uploadFiles) {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          error: `File ${file.originalname} exceeds the 15MB limit.`,
        });
      }

      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        return res.status(400).json({
          error: `File ${file.originalname} has an invalid type. Only images, PDFs, DOCs, and PPTs are allowed.`,
        });
      }

      totalSize += file.size;
    }

    if (totalSize > MAX_TOTAL_SIZE) {
      return res.status(400).json({
        error: "Total file size exceeds the 50MB limit.",
      });
    }

    const moduleData = {
      name: objectData.name,
      description: objectData.description,
      availableDate: new Date(objectData.postingDate), // Ensure the date is correctly parsed
      subject_id: parseInt(objectData.subject_id), // Set the correct subject_id if needed
    };

    // Check if a module with the same name and subject_id already exists
    const existingModule = await prisma.modules.findUnique({
      where: {
        name_subject_id: {
          name: moduleData.name,
          subject_id: moduleData.subject_id,
        },
      },
    });

    if (existingModule) {
      return res.status(409).json({
        error: "Module with the same name already exists for this subject.",
      });
    }

    // Create the new module in the database
    const newModule = await prisma.modules.create({
      data: moduleData,
    });

    req.newModule = newModule;

    // If all validations pass, proceed
    req.isValidated = true;
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Error in create:", error);
    res.status(500).json({ error: "Failed to create module." });
  }
};

export const getBySubject = async (req, res) => {
  try {
    const { subject_id } = req.params; // Get subject_id from route parameters
    const { id: user_id } = req.user; // Get user_id from the authenticated user

    // Step 1: Check if the user is assigned to the subject
    const assignedSubject = await prisma.assigned_subject.findFirst({
      where: {
        subject_id: Number(subject_id),
        user_id: Number(user_id),
      },
    });

    if (!assignedSubject) {
      return res.status(403).json({ error: "You are not assigned to this subject." });
    }

    // Step 2: Fetch modules for the given subject
    const modules = await prisma.modules.findMany({
      where: {
        subject_id: Number(subject_id),
        is_removed: 0,
        availableDate: {
          lte: new Date(),
        },
      },
    });

    res.status(200).json(modules);
  } catch (error) {
    console.error("Error in fetching modules:", error);
    res.status(500).json({ error: "Failed to fetch modules." });
  }
};

export const getAttachedFiles = async (req, res) => {
  try {
    const { module_id } = req.params;

    // Fetch the module files for the given module_id from the database
    const moduleFiles = await prisma.module_files.findMany({
      where: { module_id: parseInt(module_id) },
    });
    // If no files are found, return a response indicating this
    if (!moduleFiles || moduleFiles.length === 0) {
      return res.json({ files: [] });
    }

    // Read each file from the filesystem and convert it to a base64 string
    const transformedFiles = moduleFiles.map((file) => {
      const filePath = path.resolve("uploads/modules", file.file);

      // Check if the file exists before reading it
      if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return {
          ...file,
          error: "File not found",
        };
      }

      // Read the file as a buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Convert the file buffer to a base64 string
      const fileBase64 = fileBuffer.toString("base64");

      return {
        ...file,
        fileBase64,
        fileUrl: `/uploads/modules/${file.file}`,
      };
    });

    // Send the transformed files as the response
    console.log("transformedFiles:", transformedFiles);
    res.json({ files: transformedFiles });
  } catch (error) {
    console.error("Error in fetching attachedFiles:", error);
    res.status(500).json({ error: "Failed to fetch attachedFiles." });
  }
};
