import connectionPool from "@/utils/db";
import bcrypt from "bcrypt";
async function resetPassword(req, res) {
  const client = await connectionPool.connect();
  const { email, newPassword } = req.body;

  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {

    const result = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const userId = result.rows[0].user_id;


    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);


    await client.query(
      "UPDATE users SET password_hash = $1 WHERE user_id = $2",
      [hashedPassword, userId]
    );

    console.log("Password updated successfully for user:", userId);
    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
      success: false,
    });
  }
}

/* const result = await client.query(
      "SELECT user_id FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      console.log("User not found");
      return;
    }

    const userId = result.rows[0].user_id;
    console.log("User ID:", userId);

    const user = await client.query(
      "SELECT supabase_uuid FROM users where user_id = $1",
      [userId]
    );
    const uuid = user.rows[0].supabase_uuid;
    console.log("auth", uuid); */

// เพิ่ม logic อัปเดตรหัสผ่านใน auth หรือฐานข้อมูลตามต้องการ

/* const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Error updating password:", error.message);
      return;
    }
    await supabase.auth.updateUser({ password: newPassword }); */

/* const { data: resetData, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (resetData) {
      console.log(resetData);
    }
    if (error) {
      console.error("Error updating password:", error.message);
      return;
    }

    console.log("Password reset successful:", data); */

export default resetPassword;
