import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link สำหรับลิงก์ไปยังหน้าอื่น

export default function DropdownMenu({ toggleLogin, setShowMobileMenu }) {
  const [userName, setUserName] = useState("Bruce Wayne"); // เก็บชื่อผู้ใช้เริ่มต้น

  // ดึงข้อมูลชื่อผู้ใช้จาก localStorage หรือ sessionStorage
  useEffect(() => {
    const name = localStorage.getItem("name") || sessionStorage.getItem("name");
    if (name) {
      setUserName(name);
    }
  }, []);

  const handleItemClick = () => {
    if (setShowMobileMenu) setShowMobileMenu(false); // ตรวจสอบก่อนปิด Mobile Menu
  };

  return (
    <div className="flex flex-col py-16 lg:py-1 lg:mx-2">
      {/* ชื่อผู้ใช้ */}
      <div className="flex items-center cursor-pointer lg:hidden mb-5">
        <img
          src="https://via.placeholder.com/40"
          className="w-10 h-10 rounded-full object-cover mr-3"
          alt="Profile"
        />
        <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
          {userName}
        </span>
      </div>

      {/* เมนูใน Dropdown */}
      <div
        className="flex items-center mt-3 py-2 lg:my-1 gap-2 cursor-pointer hover:bg-gray-700 mb-5"
        onClick={handleItemClick}
      >
        <img src="/img/Booking history.png" className="w-5 h-5" alt="Booking" />
        <p className="text-[#c8cedd] text-sm font-normal">Booking History</p>
      </div>

      <div
        className="flex items-center py-2 lg:my-0 gap-2 cursor-pointer hover:bg-gray-700 mb-5"
        onClick={handleItemClick}
      >
        <img src="/img/profile.png" className="w-5 h-5" alt="Profile" />
        <p className="text-[#c8cedd] text-sm font-normal">Profile</p>
      </div>

      <Link href="/reset-password">
        <div
          className="flex items-center pt-2 pb-2 lg:pb-2 gap-2 cursor-pointer hover:bg-gray-700 mb-3"
          onClick={handleItemClick}
        >
          <img
            src="/img/reset password.png"
            className="w-5 h-5"
            alt="Reset Password"
          />
          <p className="text-[#c8cedd] text-sm font-normal">Reset Password</p>
        </div>
      </Link>

      <hr className="border-t border-[#565f7e] pb-2 mt-2 lg:mt-0 lg:py-0" />

      {/* Logout */}
      <div
        className="flex items-center py-2 lg:mt-1 gap-2 cursor-pointer hover:bg-gray-700 mt-5"
        onClick={() => {
          toggleLogin(); // จัดการสถานะการออกจากระบบ
          if (setShowMobileMenu) setShowMobileMenu(false);
        }}
      >
        <img src="/img/logout.png" className="w-5 h-5" alt="Logout" />
        <p className="text-[#c8cedd] text-sm font-normal">Log out</p>
      </div>
    </div>
  );
}
