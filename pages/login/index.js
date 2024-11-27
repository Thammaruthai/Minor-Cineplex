"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@chakra-ui/react";
import Link from "next/link";
import { Toaster as ChakraToaster, toaster } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { toast } from "react-hot-toast";
import { Toaster } from "react-hot-toast";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });

      if (response.data.success) {
        console.log("Login successful:", response.data);
        window.location.href = "/"; // Redirect to homepage after successful login
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast(
          <div className="">
            <strong>
              Your password is incorrect or this email doesn’t exist
            </strong>
            <p>Please try another password or email</p>
          </div>,
          {
            position: "bottom-right",
            style: {
              backgroundColor: "#E5364B99",
              color: "white",
            },
            icon: false,
          }
        );
      } else {
        toast.error("An unexpected error occurred. Please try again later.", {
          position: "bottom-right",
        });
      }
    }
  };
  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address", {
        position: "bottom-right",
      });
      return;
    }

    try {
      const response = await axios.post("/api/forgot-password", { email });
      if (response.data.success) {
        toast.success("Password reset email sent. Please check your inbox.", {
          position: "bottom-right",
        });
      } else {
        toast.error(response.data.error || "Failed to send reset email.", {
          position: "bottom-right",
        });
      }
    } catch (error) {
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
    <div className="min-h-screen bg-[#1a1b23]">
      <main className="mx-auto max-w-md px-4 pt-16">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Login
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm text-gray-300">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="filled"
              bg="#21263F"
              borderColor="#565F7E"
              className="text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm text-gray-300">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="filled"
              bg="#21263F"
              borderColor="#565F7E"
              className="text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-300">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 rounded border-gray-600 bg-gray-800 focus:ring-blue-500"
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
            className="w-full py-2 px-4 bg-[#4E7BEE] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Login
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have any account?{" "}
            <Link href="/" className="text-white hover:underline">
              Register
            </Link>
          </p>
        </form>
      </main>
      <Toaster />
    </div>
  );
}
