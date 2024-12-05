import { supabase } from "@/lib/supabase-client"; // เชื่อมต่อกับ Supabase
import db from "../../utils/db"; // เชื่อมต่อกับฐานข้อมูล PostgreSQL

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { email } = req.body;
  console.log("Received email:", email);

  if (!email) {
    return res.status(400).json({
      success: false,
      error: "Email address is required.",
    });
  }

  try {
    const result = await db.query("SELECT email FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "This email does not exist in our system.",
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to send reset password email.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({
      success: false,
      error: "An error occurred while processing your request.",
    });
  }
}
