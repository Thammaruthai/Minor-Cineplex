import { supabase } from "../../lib/supabaseClient";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: "Email and password are required.",
    });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: error.message || "Invalid email or password.",
      });
    }

    if (!data.user) {
      return res.status(401).json({
        success: false,
        error: "Your password is incorrect or this email doesn't exist.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: data.user,
    });
  } catch (err) {
    console.error("Server error during login:", err);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    });
  }
}
