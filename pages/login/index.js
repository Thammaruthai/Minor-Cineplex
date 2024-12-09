"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@chakra-ui/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { Field } from "@/components/ui/field";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const isFormValid = email.length > 0 && password.length >= 6;
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex สำหรับตรวจสอบ email
    return emailRegex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
        rememberMe,
      });

      if (response.data.success) {
        const { token, name } = response.data; // สมมติ API ส่ง `name` กลับมา
        if (rememberMe) {
          localStorage.setItem("token", token);
          localStorage.setItem("name", name); // เก็บชื่อผู้ใช้ใน localStorage
        } else {
          sessionStorage.setItem("token", token);
          sessionStorage.setItem("name", name); // เก็บชื่อผู้ใช้ใน sessionStorage
        }

        toast(
          <div>
            <strong>Login Successful!</strong>
            <p>Welcome to Minor Cineplex.</p>
          </div>,
          {
            position: "bottom-right",
            style: {
              borderRadius: "4px",
              color: "white",
              backgroundColor: "#00A37299",
            },
          }
        );

        window.location.href = "/";
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError(true);
        setShakeKey((prevKey) => prevKey + 1);
        toast(
          <div>
            <strong>
              Your password is incorrect or this email doesn’t exist
            </strong>
            <p>Please try another password or email</p>
          </div>,
          {
            position: "bottom-right",
            style: {
              borderRadius: "4px",
              backgroundColor: "#E5364B99",
              color: "white",
            },
          }
        );
      } else if (error.response.status === 403) {
        const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);
        toast(
          <strong>
            Account locked due to too many failed login attempts. Please try
            again after 5 minutes
          </strong>,
          {
            position: "bottom-right",
            style: {
              borderRadius: "4px",
              backgroundColor: "#E5364B99",
              color: "white",
            },
          }
        );
      } else {
        toast(
          <strong>
            An unexpected error occurred. Please try again later.
          </strong>,
          {
            position: "bottom-right",
            style: {
              borderRadius: "4px",
              backgroundColor: "#E5364B99",
              color: "white",
            },
          }
        );
      }
    }
  };

  const handleForgotPassword = async () => {
    setIsSending(true);
    if (!email) {
      setIsSending(false);
      toast.error("Please enter your email address", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const response = await axios.post("/api/forgot-password", { email });

      if (response.data.success) {
        setIsSending(false);
        toast.success("Password reset email sent. Please check your inbox.", {
          position: "bottom-right",
        });
      } else {
        setIsSending(false);
        toast.error(response.data.error || "Failed to send reset email.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      setIsSending(false);
      if (error.response && error.response.status === 404) {
        toast.error("This email does not exist in our system.", {
          position: "bottom-right",
        });
      } else {
        console.error("Error sending reset email:", error);
        toast.error("An error occurred. Please try again later.", {
          position: "bottom-right",
        });
      }
    }
  };

  return (
    <div className=" bg-[#101525]">
      <main className="mx-auto max-w-md px-4 pt-16">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-gray-300">
                Email
              </label>
              <Field>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEmail(value);
                    if (!validateEmail(value)) {
                      setEmailErrorMessage("Invalid email format.");
                    } else {
                      setEmailErrorMessage("");
                    }
                  }}
                  variant="filled"
                  bg="#21263F"
                  className={
                    error
                      ? "text-white border border-red-500 px-3 animate-shake"
                      : "text-white border border-[#565F7E] px-3"
                  }
                  key={shakeKey}
                />
              </Field>
              {emailErrorMessage && (
                <p className="text-sm text-red-500 mt-1">{emailErrorMessage}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm text-gray-300">
                Password
              </label>
              <Field>
                <Input
                  id="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="filled"
                  bg="#21263F"
                  className={
                    error
                      ? "text-white border border-red-500 px-3 animate-shake"
                      : "text-white border border-[#565F7E] px-3"
                  }
                  key={shakeKey}
                />
              </Field>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                checked={rememberMe}
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-800 focus:ring-blue-500"
                onChange={() => setRememberMe(!rememberMe)}
              />
              Remember
            </label>
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-white hover:underline"
            >
              Forget password?
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-semibold rounded-[4px] shadow-md transition duration-200 
              ${
                !isFormValid
                  ? "bg-[#4E7BEE] opacity-40 cursor-not-allowed"
                  : "bg-[#4E7BEE] hover:bg-[#1E29A8]"
              }`}
            disabled={!isFormValid}
          >
            Login
          </button>

          <p className="text-center text-sm text-[#8B93B0]">
            Don&apos;t have any account?
            <Link href="/register" className="text-white hover:underline">
              Register
            </Link>
          </p>
        </form>
        {isSending && (
          <div className="text-[#8B93B0] text-center mt-5 animate-pulse">
            <p className="text-lg font-medium">
              Sending reset password request
              <span className="dot-animate ml-1">...</span>
            </p>
          </div>
        )}
      </main>
      <Toaster />
    </div>
  );
}
