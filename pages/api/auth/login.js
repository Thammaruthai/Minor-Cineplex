import connectionPool from "@/utils/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET_KEY;
const MAX_FAILED_ATTEMPTS = 5; // จำนวนครั้งที่อนุญาตให้ล็อกอินผิด
const LOCK_TIME = 5 * 60 * 1000; // เวลาที่บัญชีจะถูกล็อค (5 นาที)
const LOGIN_ATTEMPT_TIMEFRAME = 24 * 60 * 60 * 1000; // ช่วงเวลาที่นับ

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required.",
    });
  }

  const client = await connectionPool.connect();

  try {
    const result = await client.query(
      "SELECT user_id, password_hash, locked_until, supabase_uuid FROM users WHERE email = $1", // เพิ่ม user uuid เพื่อทำ audit log หรือดึงเผื่อให้รู้ว่า user คนไหนดึง ที่ไม่ดึง name เพราะมีโอกาศซ้ำกัน
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    const user = result.rows[0];
    const currentTime = new Date();

    // ตรวจสอบสถานะการล็อค
    if (user.locked_until && currentTime < user.locked_until) {
      return res.status(403).json({
        success: false,
        error: `Account locked. Please try again after ${user.locked_until.toLocaleTimeString()}.`,
      });
    }

    // นับจำนวนการพยายามล็อกอินผิดในช่วง 5 นาทีล่าสุด
    const timeFrameStart = new Date(currentTime - LOCK_TIME);
    const attemptResult = await client.query(
      "SELECT COUNT(*) FROM login_attempts WHERE user_id = $1 AND is_successful = false AND attempt_time > $2",
      [user.user_id, timeFrameStart]
    );

    const failedAttempts = parseInt(attemptResult.rows[0].count);

    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = new Date(currentTime.getTime() + LOCK_TIME);

      // อัปเดตเวลาที่ล็อคในฐานข้อมูล
      await client.query(
        "UPDATE users SET locked_until = $1 WHERE user_id = $2",
        [lockUntil, user.user_id]
      );

      return res.status(403).json({
        success: false,
        error: `Account locked due to too many failed login attempts. Please try again after 5 minutes`,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordMatch) {
      // บันทึกการพยายามล็อกอินผิด
      await client.query(
        "INSERT INTO login_attempts (user_id, attempt_time, ip_address, is_successful) VALUES ($1, $2, $3, false)",
        [user.user_id, currentTime, req.socket.remoteAddress]
      );

      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    // รีเซ็ตการล็อกและบันทึกการล็อกอินสำเร็จ
    await client.query(
      "UPDATE users SET locked_until = NULL WHERE user_id = $1",
      [user.user_id]
    );
    await client.query(
      "INSERT INTO login_attempts (user_id, attempt_time, ip_address, is_successful) VALUES ($1, $2, $3, true)",
      [user.user_id, currentTime, req.socket.remoteAddress]
    );

    // Fetch user profile data
    const profileResult = await client.query(
      "SELECT name, profile_image FROM user_profiles WHERE user_id = $1",
      [user.user_id]
    );

    const profile = profileResult.rows[0];

    // สร้าง token
    const token = jwt.sign(
      {
        userId: user.user_id,
        email,
      },
      JWT_SECRET,
      {
        expiresIn: rememberMe ? "7d" : "1h",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      name: profile?.name || "User",
      profileImage: profile?.profile_image || null,
      userUUID: user.supabase_uuid, // เพิ่ม user uuid เพื่อทำ audit log หรือดึงเผื่อให้รู้ว่า user คนไหนดึง ที่ไม่ดึง name เพราะมีโอกาศซ้ำกัน
    });
  } catch (err) {
    console.error("Server error during login:", err);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  } finally {
    client.release();
  }
}
