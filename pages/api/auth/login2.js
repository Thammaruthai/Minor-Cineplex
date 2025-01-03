import { createClient } from "@supabase/supabase-js";
import connectionPool from "@/utils/db";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password } = req.body;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (
          error.code === "invalid_credentials" ||
          error.message.includes("invalid login credentials")
        ) {
          return res.status(400).json({
            error: "Your password is incorrect or this email doesn't exist",
          });
        }
        return res.status(400).json({
          error: error.message,
        });
      }
      return res.status(200).json({
        message: "Signed in succesfully",
        access_token: data.session.access_token,
      });
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  }
}
