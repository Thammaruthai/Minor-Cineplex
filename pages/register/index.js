import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import Navbar from "@/Components/navbar";

const inputStyle = "border border-gray-200 rounded bg-[#21263F] py-3 pl-4";
const labelStyle = "text-gray-400";
const buttonStyleEnabled = "bg-[#4E7BEE] w-full py-3"; // Enabled button style
const buttonStyleDisabled = "bg-gray-500 w-full py-3 cursor-not-allowed"; // Disabled button style
const inputFieldStyle = "flex flex-col gap-1";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formValid, setFormValid] = useState(false); // Track form validity
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Function to calculate password strength
  const calculatePasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength += 25; // Minimum length
    if (password.match(/[A-Z]/)) strength += 25; // Uppercase letter
    if (password.match(/[0-9]/)) strength += 25; // Number
    if (password.match(/[!@#$%^&*]/)) strength += 25; // Special character

    return strength;
  };

  const validateForm = (updatedForm) => {
    const isNameValid = updatedForm.name.trim() !== ""; // Check if name is not empty or whitespace
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updatedForm.email); // Validate email format
    const isPasswordValid = updatedForm.password.length >= 6; // Validate password length

    setFormValid(isNameValid && isEmailValid && isPasswordValid); // Set form validity
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    setFormData(updatedForm);

    if (name === "email") {
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setEmailError("Email must be a valid email");
      } else {
        setEmailError("");
      }
    }

    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError("");
      }
      setPasswordStrength(calculatePasswordStrength(value)); // Update password strength
    }

    validateForm(updatedForm); // Revalidate the form
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/register", formData);
      setMessage(response.data.message);
      setError("");
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-white h-screen bg-slate-900 min-h-[640px] min-w-[300px]">
        <div className="flex flex-col gap-6 w-[380px] rounded-lg text-center max-sm:w-11/12">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full text-5xl text-white bg-[#00A372]">
              ✔
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold">Registration success</h1>
            <p className="text-base text-gray-400">
              Your account has been successfully created!
            </p>
          </div>
          <button
            className="bg-[#4E7BEE] w-full py-3 mt-4"
            onClick={() => (window.location.href = "/")}
          >
            {"Back to home"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    
    <div className="w-full flex flex-col h-full items-center justify-center bg-[#070C1B] min-h-[640px] min-w-[300px] max-sm:justify-start max-sm:pt-10">
      <div className="container w-[380px] text-white rounded-lg max-sm:w-11/12">
        <h1 className="mb-6 text-4xl text-center font-bold">Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-y-6">
            <div className={inputFieldStyle}>
              <label className={labelStyle} htmlFor="name">
                Name
              </label>
              <input
                className={inputStyle}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className={inputFieldStyle}>
              <label className={labelStyle} htmlFor="email">
                Email
              </label>
              <input
                className={inputStyle}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {emailError && (
                <p className="text-sm text-red-500">{emailError}</p>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <div className={inputFieldStyle}>
              <label className={labelStyle} htmlFor="password">
                Password
              </label>
              <input
                className={inputStyle}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {passwordError && (
                <p className="text-sm text-red-500">{passwordError}</p>
              )}

              {/* Password Strength Meter */}
              {formData.password.length >= 6 && (
                <div className="mt-2">
                  {/* Password Meter */}
                  <div className="relative h-5 w-full bg-gray-700 rounded">
                    <div
                      className={`absolute top-0 left-0 h-full rounded ${
                        passwordStrength === 100
                          ? "bg-green-500"
                          : passwordStrength >= 50
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${passwordStrength}%` }}
                    >
                      <div
                        className={`text-xs w-full h-full flex items-end justify-center ${
                          passwordStrength === 100
                            ? "text-green-900"
                            : passwordStrength >= 50
                            ? "text-yellow-900"
                            : "text-red-500"
                        }`}
                      >
                        {passwordStrength === 100
                          ? "Strong"
                          : passwordStrength >= 50
                          ? "Medium"
                          : passwordStrength >= 25
                          ? "Weak"
                          : " "}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            className={`${
              formValid ? buttonStyleEnabled : buttonStyleDisabled
            } mt-6`}
            type="submit"
            disabled={!formValid}
          >
            Register
          </button>
          <div className="flex justify-center mt-6 gap-2">
            <p className="text-gray-300">Already have an account?</p>
            <Link href="/login" className="underline underline-offset-1">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div></>
  );
}
