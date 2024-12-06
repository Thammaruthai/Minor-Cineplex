import validateToken from "@/utils/validateToken";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req, res) {
  // ตรวจสอบ HTTP Method
  console.log("test 2");

  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // ใช้ validateToken
  validateToken(req, res, async () => {
    try {
      // ดึงข้อมูลจาก Supabase
      const { data, error } = await supabase.from("halls").select("*");

      if (error) {
        console.error("Error fetching data:", error);
        return res.status(500).json({ success: false, error: error.message });
      }

      // ส่งข้อมูลกลับ
      return res.status(200).json({ success: true, data });
    } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({
        success: false,
        error: "An unexpected error occurred.",
      });
    }
  });
}
