import jwt from "jsonwebtoken";
import connectionPool from "@/utils/db";

export default async function getUserProfile(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const { userId } = decoded;

    const client = await connectionPool.connect();
    const result = await client.query(
      "SELECT users.user_id , name , users.email , profile_image FROM user_profiles INNER JOIN users ON user_profiles.user_id = users.user_id WHERE users.user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
