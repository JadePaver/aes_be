// src/controllers/userController.js
import prisma from "../prismaClient.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const toggleLockUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch the current user to get the current isLocked value
    const user = await prisma.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Toggle the isLocked value
    const updatedIsLocked = user.isLocked === 1 ? 0 : 1;

    // Update the user's isLocked status
    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: {
        isLocked: updatedIsLocked,
        dateModified: new Date(), // Update the modification date
      },
    });

    res.status(200).json({
      message:
        updatedIsLocked === 1
          ? `${updatedUser?.username} locked successfully`
          : `${updatedUser?.username} unlocked successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to toggle user lock status" });
  }
};

export const resetPassword = async (req, res) => {
  const { id } = req.params;

  try {
    const defaultPassword = await bcrypt.hash("123456", 10);

    const updatedUser = await prisma.users.update({
      where: { id: parseInt(id) },
      data: { password: defaultPassword, dateModified: new Date() },
    });

    res.status(200).json({
      message: `${updatedUser.fName} ${updatedUser.lName} password reset successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to reset user password" });
  }
};

export const updateProfileDetals = async (req, res) => {
  const { id } = req.body; // Use the ID to find the user
  const {
    user_code,
    role_id,
    fName,
    lName,
    mName,
    ext_name,
    birthDate,
    sex_id,
    contact,
    email,
    username,
    password,
  } = req.body;

  try {
    // Update user in the database
    const updatedUser = await prisma.users.update({
      where: { id: Number(id) },
      data: {
        role_id,
        fName,
        lName,
        mName,
        ext_name,
        birthDate: new Date(birthDate), // Ensure date format is compatible
        sex_id,
        contact,
        email,
        username,
        password,
        dateModified: new Date(), // Update modification timestamp
      },
      include: {
        role: true,
        sex: true,
        profile_image: true,
      },
    });

    res.status(200).json({
      message: "User profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to update user profile details" });
  }
};

export const isUsernameTaken = async (req, res) => {
  const { username } = req.body;
  const { id } = req.params;

  try {
    // Check if any user has the specified username, excluding the current user
    const isUsernameExist = await prisma.users.findFirst({
      where: {
        username: username,
        id: {
          not: parseInt(id), // Exclude the current user by ID
        },
      },
    });

    if (isUsernameExist) {
      return res
        .status(200)
        .json({ available: false, message: "Username is already taken." });
    }

    res
      .status(200)
      .json({ available: true, message: "Username is available." });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Error checking username availability." });
  }
};

export const getProfileDetailByID = async (req, res) => {
  try {
    const { id } = req.params;

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

    res.send(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch user profile details" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      include: {
        assigned_classroom: {
          include: {
            classroom: true,
          },
        },
      },
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const loginUser = async (req, res) => {
  console.log("loging in");

  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    console.log("loging in");
    const user = await prisma.users.findUnique({
      where: { username },
      include: {
        profile_image: {
          select: {
            file: true,
          },
        },
      },
    });

    if (!user) {
      return res
        .status(401)
        .send({ error: "Invalid usernaasfasfsme or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send({ error: "Invalid username or password" });
    }

    const tokenPayload = {
      id: user.id,
      username: user.username,
      role: user.role_id,
      ...(user.profile_image && { profileImage: user.profile_image.file }), // Include profileImage if it exists
    };
    // Generate JWT token
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_TOKEN, {
      expiresIn: "1h",
    });

    console.log("apples");
    // Send the response with token and user details (excluding password)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        role: user.role_id,
        ...(user.profile_image && { profileImage: user.profile_image.file }),
      },
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
    console.log("newUser:", newUser);

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
    console.log("token:", token);
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
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the current password with the hashed password in the database
    const isPasswordMatch = await bcrypt.compare(current, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
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
    res.status(200).send({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to change password" });
  }
};
