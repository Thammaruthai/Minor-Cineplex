import { useState } from "react";
import axios from "axios";
import Link from "next/link";

const inputStyle = "border border-gray-200 rounded bg-[#21263F] py-3 pl-4";
const labelStyle = "text-gray-400";
const buttonStyle = "bg-[#4E7BEE] w-full py-3";
const inputFieldStyle = "flex flex-col gap-1";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [emailError, setEmailError] = useState(""); // Email-specific error
  const [passwordError, setPasswordError] = useState(""); // Password-specific error
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // อัปเดตค่าของฟอร์ม
    setFormData({
      ...formData,
      [name]: value,
    });

    // Validation สำหรับอีเมล ต่อทุกๆการพิมพ์
    if (name === "email") {
      if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setEmailError("Email must be a valid email");
      } else {
        setEmailError(""); // ล้าง error ถ้าถูกต้อง
      }
    }

    // Validation สำหรับรหัสผ่าน ต่อทุกๆการพิมพ์
    if (name === "password") {
      if (value.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
      } else {
        setPasswordError(""); // ล้าง error ถ้าถูกต้อง
      }
    }
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


  // ถ้่ากดส่ง แล้ว OK 
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-white h-screen bg-slate-900">

        <div className="flex flex-col gap-6 w-[380px]  rounded-lg text-center">
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
      <div className=" w-full flex flex-col h-[100vh] items-center justify-center bg-[#070C1B]">
        <div className=" container w-[380px]   text-white  rounded-lg">
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

                {error && !emailError && (
                  <p className="text-sm text-red-500 ">{error}</p>
                )}
                {emailError && !error && (
                  <p className="text-sm text-red-500 ">{emailError}</p>
                )}
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
                  <p className="text-sm text-red-500 ">{passwordError}</p>
                )}
              </div>
            </div>
            <button className={buttonStyle + " mt-6"} type="submit">
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
      </div>
    </>
  );
}
