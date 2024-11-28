// /pages/api/logout.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, error: "Method not allowed" });
  }

  // ลบ token ที่เก็บใน session
  res.setHeader("Set-Cookie", [
    `token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`,
  ]);

  // ส่งคำตอบว่า logout สำเร็จ
  return res.status(200).json({ success: true });
}
