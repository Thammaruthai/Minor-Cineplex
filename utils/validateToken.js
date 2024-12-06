import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;

export default function validateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Authorization token missing or invalid.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    // ตรวจสอบ Token
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    console.error("Invalid token:", err);
    return res.status(500).json({
      success: false,
      error: "Invalid or expired token.",
    });
  }
}
