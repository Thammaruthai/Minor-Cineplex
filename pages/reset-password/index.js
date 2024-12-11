import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Input } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";

export default function ResetPassword() {
  const router = useRouter();
  const { email } = router.query; // ดึงจาก URL
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const isFormValid = newPassword.length >= 6 || confirmPassword.length > 6;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const response = await axios.post("/api/auth/reset-password", {
        email,
        newPassword,
      });

      if (response.data.success) {
        setSuccess(true);

        // หน่วงเวลา 5 วินาทีแล้ว redirect ไปที่หน้า login
        setTimeout(() => {
          router.push("/login");
        }, 5000); // 5 วินาที (5000ms)
      } else {
        toast.error("Failed to reset password. Please try again.", {
          position: "bottom-right",
        });
      }
    } catch (err) {
      console.log(err);
      toast.error("Error resetting password. Please try again.", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="bg-[#101525]">
      <main className="mx-auto max-w-md px-4 pt-16">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Reset Password
        </h1>
        {success ? (
          <div>
            <p className="text-green-500">
              Password reset successful! You can now login with your new
              password.
            </p>
            <p className="text-white">Redirecting to login page...</p>
          </div>
        ) : (
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="new-password" className="block  text-gray-300">
                New Password
              </label>
              <Input
                id="new-password"
                type="password"
                placeholder="New password"
                variant="filled"
                bg="#21263F"
                borderColor="#565F7E"
                value={newPassword}
                className="text-white border border-[#565F7E] px-3"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-gray-300">
                Confirm Password
              </label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                variant="filled"
                bg="#21263F"
                borderColor="#565F7E"
                value={confirmPassword}
                className="text-white border border-[#565F7E] px-3"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 px-4 text-white font-bold rounded-[4px] shadow-md transition duration-200 
                ${
                  !isFormValid
                    ? "bg-[#4E7BEE] opacity-40 cursor-not-allowed"
                    : "bg-[#4E7BEE] hover:bg-[#1E29A8]"
                }`}
              disabled={!isFormValid}
            >
              Reset Password
            </button>
          </form>
        )}
      </main>
      <Toaster />
    </div>
  );
}
