import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessSecret = process.env.ACCESS_SECRET;

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  // console.log("Full header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1]; // 🔥 remove Bearer

  try {
    const decoded = jwt.verify(token, accessSecret);
    req.user = decoded;
    console.log("y raha data",req.user)
    next();
  } catch (err) {
    console.log("JWT Error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export default verifyToken;