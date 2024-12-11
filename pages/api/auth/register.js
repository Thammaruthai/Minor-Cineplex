// pages/api/register.js
import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "@/utils/db"; // Import pg client connection

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  

  const client = await connectionPool.connect();
  const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress; // Get user IP

  try {
    // Check if email already exists
    const emailCheckQuery = "SELECT user_id FROM users WHERE email = $1";
    const emailCheckResult = await client.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      // Log failed attempt (Email already in use)
      await logRegisterAttempt(
        client,
        email,
        ipAddress,
        "Failure",
        "Email already in use"
      );
      return res.status(400).json({ error: "Email already in use" });
    }

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) {
      console.error("Error signing up:", authError);

      // Log failed attempt (Supabase Auth error)
      await logRegisterAttempt(
        client,
        email,
        ipAddress,
        "Failure",
        authError.message
      );
      return res.status(400).json({ error: authError.message });
    }

    const supabaseUserId = authData.user.id; // Supabase Auth UUID
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into the `users` table
    const insertUserQuery = `
      INSERT INTO users (email, password_hash, supabase_uuid)
      VALUES ($1, $2, $3)
      RETURNING user_id;
    `;
    const userResult = await client.query(insertUserQuery, [
      email,
      hashedPassword,
      supabaseUserId,
    ]);

    const userId = userResult.rows[0].user_id;

    // Insert user profile into `user_profiles` table
    const insertProfileQuery = `
      INSERT INTO user_profiles (user_id, name)
      VALUES ($1, $2);
    `;
    await client.query(insertProfileQuery, [userId, name]);

    // Insert audit log into `audit_logs` table
    const insertAuditLogQuery = `
      INSERT INTO audit_logs (action, entity_type, entity_id, performed_by)
      VALUES ($1, $2, $3, $4);
    `;
    await client.query(insertAuditLogQuery, [
      "Register User",
      "users",
      userId,
      userId, // Assumes the user is performing their own registration
    ]);

    // Log successful registration attempt
    await logRegisterAttempt(client, email, ipAddress, "Success", null);

    // Send success response
    return res
      .status(201)
      .json({ message: "User registered successfully!", userId });
  } catch (error) {
    console.error("Internal Server Error:", error);

    // Log failed attempt (Internal server error)
    await logRegisterAttempt(
      client,
      email,
      ipAddress,
      "Failure",
      "Internal Server Error"
    );

    return res.status(500).json({ error: "Internal Server Error" });
  } finally {
    // Release the connection
    client.release();
  }
}

// Helper function to log register attempts
async function logRegisterAttempt(
  client,
  email,
  ipAddress,
  status,
  failureReason
) {
  try {
    const insertRegisterAttemptQuery = `
      INSERT INTO register_attempts (email, ip_address, status, failure_reason)
      VALUES ($1, $2, $3, $4);
    `;
    await client.query(insertRegisterAttemptQuery, [
      email,
      ipAddress,
      status,
      failureReason,
    ]);
  } catch (err) {
    console.error("Error logging register attempt:", err);
  }
}
