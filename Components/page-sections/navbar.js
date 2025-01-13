import { useState, useRef, useEffect } from "react";
import Link from "next/link"; // Import Link สำหรับลิงก์ไปยังหน้าอื่น
import DropdownMenu from "../landing-page/dropdown-menu";
import { useUser } from "@/context/user-context";
import axios from "axios";
import { useRouter } from "next/router";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(""); // State สำหรับเก็บชื่อผู้ใช้
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { userData } = useUser();
  const router = useRouter();
  const mobileMenuRef = useRef(null); // ใช้สำหรับตรวจจับคลิกภายนอก (Mobile Menu)
  const dropdownRef = useRef(null);
  const hamburgerMenuRef = useRef(null); // ใช้สำหรับตรวจจับคลิกภายนอก (Desktop Dropdown)

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setShowDropdown(false);
  };

  // เมื่อ Component ถูก Mount ให้ดึงข้อมูลชื่อจาก localStorage หรือ sessionStorage
  useEffect(() => {
    const isLogin =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (isLogin && userData?.name) {
      setIsLoggedIn(true);
      setUserName(userData.name); // อัปเดตชื่อผู้ใช้ใน State
    } else {
      setIsLoggedIn(false);
      setUserName(""); // Reset username if logged out
    }
  }, [userData]);

  const handleLogout = async () => {
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    router.push("/");
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu(!showMobileMenu);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // ถ้าคลิกนอกทั้ง Mobile Menu และ Hamburger Menu
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerMenuRef.current &&
        !hamburgerMenuRef.current.contains(event.target)
      ) {
        setShowMobileMenu(false); // ปิดเมนู
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ปิด Desktop Dropdown เมื่อคลิกภายนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="relative z-50">
      {/* Background Blur */}
      <div
        className="absolute inset-x-0 top-0 h-16 lg:h-20 bg-black bg-opacity-5 backdrop-blur-lg w-full
        border-b-[1.5px] border-[#21263f] z-40 "
      ></div>

      <div className="relative flex justify-between items-center bg-transparent px-4 pt-2 lg:pt-[14px] lg:mx-14">
        {/* Logo */}
        <Link href="/">
          <img src="/img/logo.png" alt="Logo" className="h-8 z-50 relative" />
        </Link>

        {/* Mobile Menu Button */}
        <div
          ref={hamburgerMenuRef}
          className="rounded-sm border-none flex items-center justify-center mt-2 active:scale-95 transition-transform duration-150 lg:hidden z-[60]"
          onClick={toggleMobileMenu}
        >
          <img
            src="/img/Ham.png"
            alt="Menu"
            className="w-6 h-5 m-1 z-[60] relative"
          />
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4 lg:items-center z-50">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <button className="px-4 py-2 text-white text-base font-normal rounded hover:border hover:border-[#8b93b0]">
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button className="w-[134px] h-[48px] text-white text-base font-bold rounded hover:border hover:border-[#8b93b0] z-10">
                  Register
                </button>
              </Link>
            </>
          ) : (
            <div className="relative top-1" ref={dropdownRef}>
              <div
                className="flex items-center cursor-pointer"
                onClick={toggleDropdown}
              >
                <img
                  src={userData?.profile_image || "/img/default-profile.png"}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  alt="Profile"
                />
                <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
                  {userName} {/* แสดงชื่อผู้ใช้ */}
                </span>
                <img src="/img/dropDown.png" alt="Dropdown Icon" />
              </div>

              {/* Dropdown Menu for Desktop */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 h-44 w-[182px] bg-[#21263f] rounded shadow-lg z-50">
                  <DropdownMenu toggleLogin={handleLogout} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          ref={mobileMenuRef} // ใช้ ref เพื่อตรวจจับการคลิกภายนอก
          className="absolute z-[100] w-screen top-[64px] sm:hidden lg:hidden bg-[#21263f] border border-[#21263f] bg-opacity-5 backdrop-blur-lg flex flex-col px-5"
        >
          {!isLoggedIn ? (
            <div className="flex flex-col items-center">
              <Link href="/login">
                <button
                  className="hover:border hover:border-[#8b93b0] text-white text-base font-normal rounded mt-8 py-4 w-auto px-10"
                  onClick={() => {
                    toggleLogin();
                    setShowMobileMenu(false);
                  }}
                >
                  Login
                </button>
              </Link>
              <Link href="/register">
                <button
                  className="hover:border hover:border-[#8b93b0] text-white text-base font-bold rounded my-4 mb-6 w-auto py-4 px-10"
                  onClick={() => {
                    toggleLogin();
                    setShowMobileMenu(false);
                  }}
                >
                  Register
                </button>
              </Link>
            </div>
          ) : (
            <DropdownMenu
              toggleLogin={handleLogout}
              setShowMobileMenu={setShowMobileMenu}
            />
          )}
        </div>
      )}
    </nav>
  );
}
