import jwt from "jsonwebtoken";
import connectionPool from "@/utils/db";

const JWT_SECRET = process.env.SECRET_KEY;

export default async function handler(req, res) {
  if (req.method === "GET") {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        error: "Unauthorized: Token missing",
      });
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded token:", decoded);

      const { userId, email } = decoded;
      const query = `SELECT users.user_id, users.email, user_profiles.name as username
      FROM users 
      INNER JOIN user_profiles ON user_profiles.user_id = users.user_id
      WHERE users.user_id = $1`;
      const values = [userId];
      const { rows } = await connectionPool.query(query, values);
      if (rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      const { username } = rows[0];
      res.status(200).json({
        id: userId,
        username,
        email,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
