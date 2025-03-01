import multer from "multer";
import path from "path";
import fs from "fs";
import prisma from "../prismaClient.js";
import jwt from "jsonwebtoken";

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
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { id: userId } = req.params;
    const newFilename = req.file.filename;
    const imagePath = path.join("/uploads", newFilename);

    // Update or insert profile image record
    const profileImage = await prisma.profile_image.upsert({
      where: { user_id: Number(userId) },
      update: { file: newFilename },
      create: {
        user_id: Number(userId),
        label: "Profile Image",
        file: newFilename,
      },
    });

    // Fetch the updated user info
    const user = await prisma.users.findUnique({
      where: { id: Number(userId) },
      include: { profile_image: true },
    });

    // Prepare new token payload
    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role_id,
    };

    // Sign new token
    const newToken = jwt.sign(tokenPayload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1h",
    });

    const filePath = path.resolve("uploads", newFilename);

    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return {
        ...file,
        error: "File not found",
      };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const fileBase64 = fileBuffer.toString("base64");

    res.status(200).json({
      message: "Profile image uploaded and token updated successfully",
      newToken, // Return the new token to the client
      fileBase64: fileBase64,
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

export const getByID = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const userData = await prisma.users.findUnique({
      where: { id: parseInt(user_id) },
      include: { profile_image: true },
    });


    let data;
    if (userData?.profile_image?.file) {
      const filePath = path.resolve("uploads", userData.profile_image.file);

      if (!fs.existsSync(filePath)) {
        console.error("File not found:", filePath);
        return {
          ...file,
          error: "File not found",
        };
      }

      const fileBuffer = fs.readFileSync(filePath);
      const fileBase64 = fileBuffer.toString("base64");

      data = fileBase64;
    }

    res.json(data);
  } catch (error) {
    console.error("Error getting image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
