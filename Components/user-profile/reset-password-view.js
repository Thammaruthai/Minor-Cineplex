import { Input } from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
export default function ResetPasswordView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const isFormValid = newPassword.length >= 6 || confirmPassword.length > 6;
  const fetchUserProfile = async () => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get("api/users/profile", config);

      setEmail(response.data.data.email);
    } catch (error) {
      console.log("Error fetching user profile", error);
    }
  };

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
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <div className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-6">Reset password</h1>
      <main className="">
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
                className="text-white border border-[#565F7E] px-3 w-[380px]"
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
                className="text-white border border-[#565F7E] px-3 w-[380px]"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className={`mt-4 px-6 py-2 bg-transparent border border-[#8B93B0] text-white rounded font-bold 
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
