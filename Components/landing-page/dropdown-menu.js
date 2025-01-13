import { useState, useEffect } from "react";
import Link from "next/link"; // Import Link สำหรับลิงก์ไปยังหน้าอื่น
import Image from "next/image";
import { useUser } from "@/context/user-context";

export default function DropdownMenu({
  toggleLogin,
  setShowMobileMenu,
  setShowDropdown,
  showDropdown,
}) {
  const [userName, setUserName] = useState("");
  const { userData } = useUser();

  useEffect(() => {
    const name = userData?.name || "";
    if (name) {
      setUserName(name);
    }
  }, [userData]);

  const handleItemClick = () => {
    if (setShowMobileMenu) {
      setShowMobileMenu(false);
    } else {
      if (setShowDropdown) setShowDropdown(false);
    }
  };

  return (
    <div className="flex flex-col py-10 md:py-1 md:mx-2">
      {/* ชื่อผู้ใช้ */}
      <div className="flex items-center cursor-pointer md:hidden mb-5">
        <Image
          src={userData?.profile_image}
          className="w-10 h-10 rounded-full object-cover mr-3"
          width={40}
          height={40}
          alt="Profile"
        />
        <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
          {userName}
        </span>
      </div>

      {/* เมนูใน Dropdown */}
      <Link href={{ pathname: "/profile", query: { view: "booking-history" } }}>
        <div
          className="flex items-center mt-3 py-2 lg:my-1 gap-2 cursor-pointer hover:bg-gray-700 mb-5"
          onClick={handleItemClick}
        >
          <Image
            src="/img/Booking history.png"
            className="w-5 h-5"
            width={0}
            height={0}
            alt="Booking"
          />
          <p className="text-[#c8cedd] text-sm font-normal">Booking History</p>
        </div>
      </Link>
      <Link href="/profile">
        <div
          className="flex items-center py-2 lg:my-0 gap-2 cursor-pointer hover:bg-gray-700 mb-5"
          onClick={handleItemClick}
        >
          <Image
            src="/img/profile.png"
            className="w-5 h-5"
            alt="Profile"
            width={0}
            height={0}
          />

          <p className="text-[#c8cedd] text-sm font-normal">Profile</p>
        </div>
      </Link>
      <Link href={{ pathname: "/profile", query: { view: "reset-password" } }}>
        <div
          className="flex items-center pt-2 pb-2 md:pb-2 gap-2 cursor-pointer hover:bg-gray-700 mb-3"
          onClick={handleItemClick}
        >
          <Image
            src="/img/reset password.png"
            className="w-5 h-5"
            alt="Reset Password"
            width={0}
            height={0}
          />
          <p className="text-[#c8cedd] text-sm font-normal">Reset Password</p>
        </div>
      </Link>

      <hr className="border-t border-[#565f7e] pb-2 mt-2 md:mt-0 md:py-0" />

      {/* Logout */}
      <div
        className="flex items-center py-2 md:mt-1 gap-2 cursor-pointer hover:bg-gray-700 mt-5"
        onClick={() => {
          toggleLogin(); // จัดการสถานะการออกจากระบบ
          if (setShowMobileMenu) setShowMobileMenu(false);
        }}
      >
        <Image
          src="/img/logout.png"
          className="w-5 h-5"
          alt="Logout"
          width={0}
          height={0}
        />
        <p className="text-[#c8cedd] text-sm font-normal">Log out</p>
      </div>
    </div>
  );
}
