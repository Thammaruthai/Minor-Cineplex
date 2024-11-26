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
  // Check HTTP method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse request body
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      console.error("Error signing up:", authError);
      return res.status(400).json({ error: authError.message });
    }

    const supabaseUserId = authData.user.id; // Supabase Auth UUID
    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await connectionPool.connect();

    // Insert user into the `users` table
    const insertUserQuery = `
      INSERT INTO users (email, password_hash, supabase_uuid)
      VALUES ($1, $2, $3)
      RETURNING user_id;
    `;
    const userResult = await connectionPool.query(insertUserQuery, [
      email,
      hashedPassword,
      supabaseUserId,
    ]);

    const userId = userResult.rows[0].user_id; // Adjusted to match RETURNING user_id

    // Insert user profile into `user_profiles` table
    const insertProfileQuery = `
      INSERT INTO user_profiles (user_id, name)
      VALUES ($1, $2);
    `;
    await connectionPool.query(insertProfileQuery, [userId, name]);

    // Send success response
    return res
      .status(201)
      .json({ message: "User registered successfully!", userId });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
