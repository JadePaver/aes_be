// middleware/authenticateToken.js
import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("not authorized");
  if (!token) return res.status(401).json({ error: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET_TOKEN, (err, user) => {
    console.log("error:", err);
    if (err) return res.status(403).json({ error: "Token is invalid" });
    req.user = user; // Attach decoded user data to request
    next();
  });
};
