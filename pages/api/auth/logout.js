export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  try {
    // ลบ token
    res.setHeader("Set-Cookie", [
      `token=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`, // เพิ่ม Secure หากใช้ HTTPS
    ]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while logging out. Please try again later.",
    });
  }
}
