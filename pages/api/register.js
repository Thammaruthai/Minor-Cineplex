// pages/api/register.js
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, password } = req.body;

  // Validate inputs
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simulate saving user data (e.g., to a database)
    const user = { name, email, password: hashedPassword };

    console.log("User saved:", user); // Replace with actual DB logic

    // Send success response
    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
