import jwt from "jsonwebtoken";
import connectionPool from "@/utils/db";

export default async function updateUserProfile(req, res) {
  try {
    if (req.method !== "PATCH") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization token missing or invalid format" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = decoded;

    const { name, email, profile_image } = req.body;

    if (!name && !email && !profile_image) {
      return res.status(400).json({ message: "No data to update" });
    }

    const client = await connectionPool.connect();
    try {
      await client.query("BEGIN");

      // อัปเดต email ในตาราง users
      if (email) {
        await client.query("UPDATE users SET email = $1 WHERE user_id = $2", [
          email,
          userId,
        ]);
      }

      // อัปเดต name และ profile_image ในตาราง user_profiles
      const profileFields = [];
      const profileValues = [];
      if (name) {
        profileFields.push("name = $1");
        profileValues.push(name);
      }
      if (profile_image) {
        profileFields.push("profile_image = $2");
        profileValues.push(profile_image);
      }

      if (profileFields.length > 0) {
        await client.query(
          `UPDATE user_profiles SET ${profileFields.join(
            ", "
          )} WHERE user_id = $3`,
          [...profileValues, userId]
        );
      }
      await client.query("COMMIT");

      res
        .status(200)
        .json({ success: true, message: "User profile updated successfully" });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error(error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}
