import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    const userData = await prisma.users.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!userData) {
      res.status(404).json({ error: "User Not Found" });
    }

    const newAccessToken = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role_id },
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "1m" } // 30 minutes
    );

    // Generate a new refresh token (longer expiration time)
    const newRefreshToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: "7d" } // 7 days (or whatever duration you prefer)
    );

    res
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
