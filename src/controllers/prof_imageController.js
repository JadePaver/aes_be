import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prismaClient.js";

// Set up Multer storage to define where and how to store the uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Store uploaded images in the 'uploads/' directory
    cb(null, "../aes-be/uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique name for the file to prevent overwriting
    const ext = path.extname(file.originalname);
    const uniqueName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, uniqueName); // Use this unique name for the file
  },
});

// Create the multer instance
const upload = multer({ storage });

// Export the uploadImage function to handle image upload
export const uploadImage = upload.single("profileImage"); // Handle single image upload (named 'profileImage')

// Controller function to save the file path to the database
export const uploadImageHandler = async (req, res) => {
  try {
    // Check if the file exists
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Get user ID from params
    const { id: userId } = req.params;

    // Save the file path
    const imagePath = path.join("/uploads", req.file.filename);
    console.log("req:", req.file)

    // Upsert (insert or update) profile image in the `profile_image` table for this user
    const profileImage = await prisma.profile_image.upsert({
      where: { user_id: Number(userId) },
      update: {
        file: req.file.filename, // Update existing image path
      },
      create: {
        user_id: Number(userId),
        label: "Profile Image",
        file: req.file.filename, // Insert new image path
      },
    });

    res.status(200).json({
      message: "Profile image uploaded successfully",
      imagePath: req.file.filename,
      profileImage,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const serveImage = (req, res) => {
  const { filename } = req.params;
  const imagePath = path.resolve("uploads", filename);

  if (!fs.existsSync(imagePath)) {
    console.error("File not found:", imagePath);
    return res.status(404).json({ error: "Image not found" });
  }

  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).json({ error: "Error sending file" });
    }
  });
};
