// src/controllers/userController.js
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Get all users
export const getProfileDetailByID = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("id:", id);

    const user = await prisma.users.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        role: {
          select: {
            name: true,
          },
        },
        sex: {
          select: {
            label: true,
          },
        },
        profile_image: {
          select: {
            label: true,
            file: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    console.log("user:", user);
    res.send(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch user profile details" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany(); // Use the correct model name 'users'
    res.json(users);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role_id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    // Send the response with token and user details (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, username: user.username, role: user.role_id },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

export const registUser = async (req, res) => {
  const {
    fname,
    mname,
    lname,
    ext,
    birthDate,
    sex,
    contact,
    email,
    type,
    studentCode,
    username,
    password,
    code,
  } = req.body;
  console.log("data:", req.body);

  // Check if user type is Admin or Operator and prevent assignment
  if (type === 1 || type === 5) {
    return res.status(403).json({
      error: "You are not allowed to assign user type to Admin or Operator",
    });
  }

  // Validate required fields
  if (
    !fname ||
    !mname ||
    !lname ||
    !birthDate ||
    !sex ||
    !contact ||
    !email ||
    !type ||
    !username ||
    !password
  ) {
    return res
      .status(400)
      .json({ error: "Please fill in all required fields." });
  }

  try {
    // Check if username already exists
    const existingUser = await prisma.users.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Username already exists" });
    }

    // Check if the provided code exists in archive_codes and is unassigned
    const archiveCode = await prisma.archive_codes.findUnique({
      where: { code },
    });

    if (!archiveCode || archiveCode.user_id) {
      return res.status(400).json({
        error: "Invalid or already assigned code.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await prisma.users.create({
      data: {
        fName: fname,
        mName: mname,
        lName: lname,
        ext_name: ext,
        role_id: type,
        birthDate: new Date(birthDate),
        sex_id: sex,
        contact,
        email,
        username,
        password: hashedPassword,
      },
    });

    await prisma.archive_codes.update({
      where: { code },
      data: { user_id: newUser.id },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, role: newUser.role_id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1h" }
    );

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser.id, username: newUser.username },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params; // Assuming user_id is passed in the URL
  const { current, newPass } = req.body;

  try {
    // Retrieve the user from the database by user_id
    const user = await prisma.users.findUnique({
      where: { id: Number(id) },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(current, user.password);
      if (!isPasswordMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPass, 10);

    // Update the password in the database
    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
      },
    });
    // Send success response
    res.status(200).send({ message: 'Password updated successfully' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
