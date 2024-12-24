import { Input } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import jwtInterceptor from "@/utils/jwt-interceptor";
import { useUser } from "@/context/user-context";
export default function ResetPasswordView() {
  const router = useRouter();
  const { userData, fetchUserProfile } = useUser();
  const email = userData.email;
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
  useEffect(() => {
    jwtInterceptor();
    fetchUserProfile();
  }, []);

  return (
    <div className="flex-1 md:p-8">
      <h1 className="text-4xl font-bold mb-10">Reset password</h1>
      <main className="max-w-md">
        {success ? (
          <div>
            <p className="text-green-500">
              Password reset successful! You can now login with your new
              password.
            </p>
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
                className="text-white border border-[#565F7E] px-3 py-6"
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
                className="text-white border border-[#565F7E] px-3 py-6"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`mt-4 px-8 py-3 bg-transparent border border-[#8B93B0] text-white rounded font-bold 
                ${
                  !isFormValid
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-gray-800"
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
