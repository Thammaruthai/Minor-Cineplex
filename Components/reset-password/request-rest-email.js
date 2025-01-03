// components/RequestResetEmail.jsx
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function RequestResetEmail() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSendResetEmail = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password2`,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password reset email sent! Check your inbox.");
    }
  };

  return (
    <div>
      <h1 className="text-white">Reset Your Password</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <p className="hover:underline cursor-pointer text-red-500" onClick={handleSendResetEmail}>Send Reset Email</p>
      {message && <p className="text-white">{message}</p>}
    </div>
  );
}
