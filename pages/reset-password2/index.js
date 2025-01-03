import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResetPassword2() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      localStorage.removeItem("sb-legtiifzmznryewotxso-auth-token");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    }
  };

  return (
    <div className="mt-20">
      <h1 className="text-white">Set a New Password</h1>
      <input
        type="password"
        placeholder="Enter your new password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <p className="text-red-500" onClick={handleResetPassword}>Update Password</p>
      {message && <p className="text-white">{message}</p>}
    </div>
  );
}
