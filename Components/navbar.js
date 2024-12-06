// import { useState } from "react";

// export default function Navbar() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false); // เพิ่มสถานะสำหรับมือถือ

//   // Toggle login/logout state
//   const toggleLogin = () => {
//     setIsLoggedIn(!isLoggedIn);
//     setShowDropdown(false); // Close dropdown if logging out
//   };

//   // Toggle dropdown เปิดปิด (สำหรับ desktop)
//   const toggleDropdown = () => {
//     setShowDropdown((prev) => !prev);
//   };

//   // Toggle dropdown เปิดปิด (สำหรับ mobile)
//   const toggleMobileMenu = () => {
//     setShowMobileMenu((prev) => !prev);
//   };

//   return (
//     <nav className="relative">
//       {/* Background Blur */}
//       <div
//         className="absolute inset-x-0 top-0 h-16 lg:h-20 bg-black bg-opacity-5 backdrop-blur-lg w-full
//         border-b-2 border-[#21263f]"
//       ></div>

//       <div className="relative flex justify-between items-center bg-transparent px-4 pt-2 lg:pt-[14px] lg:mx-14">
//         <img src="/img/logo.png" alt="Logo" className="h-8" />

//         {/* Button for Mobile Menu */}
//         <button
//           className="rounded-sm border-none flex items-center justify-center mt-2 active:scale-95 transition-transform duration-150 lg:hidden"
//           onClick={toggleMobileMenu} // เชื่อมกับ toggleMobileMenu
//         >
//           <img src="/img/Ham.png" alt="Menu" className="w-6 h-5 m-1" />
//         </button>

//         {/* Desktop Menu */}
//         <div className="hidden lg:flex space-x-4">
//           {!isLoggedIn ? (
//             <>
//               <button
//                 className="px-4 py-2 text-white text-base font-normal rounded"
//                 onClick={toggleLogin}
//               >
//                 Login
//               </button>
//               <button className="border border-[#8b93b0] w-[134px] h-[48px] text-white text-base font-bold rounded">
//                 Register
//               </button>
//             </>
//           ) : (
//             <div className="relative top-1">
//               <div
//                 className="flex items-center cursor-pointer "
//                 onClick={toggleDropdown}
//               >
//                 <img
//                   src="https://s3-alpha-sig.figma.com/img/10c3/32fe/6920a3869b17c5dfa8ac6d7883ce535d?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oVMqRicEIUcjMAzcq65TmJDS3~a3aM6pHoHE~YZqEZHTrcmHuaFRPDEyM3UrK7jxeEC0fk-9fEROCPXJF9AIoaVtaZxVLOiu4SpYDaQ-sGI2ZX45SEJapto-NwLJ9vKeLZQYwEKjBzS9wijXOid2oS2xZkWXfVvMWo91k3IKAnLIDYEYfio03wOUE0JYUqLbwfoVK~YZZfTLsgHqqQud1eYhyBEpi-Tq9VddtMbQrkiLmDN~ex1RR6Uu8MJDfm~qHgPH7itwTYSy9Y2TXBEyyXu-1rJfEIbvOCwQltN7h1jX4kJJRRgT0X5HHDq06hwIv~9U2ueWxzW9yB5H3YJhPQ__"
//                   className="w-10 h-10 rounded-full object-cover mr-3"
//                   alt="Profile"
//                 />
//                 <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
//                   Bruce Wayne
//                 </span>
//                 <img src="/img/dropDown.png" alt="Dropdown Icon" />
//               </div>

//               {/* Dropdown Menu for Desktop */}
//               {showDropdown && (
//                 <div className="absolute right-0 mt-3 h-44 w-[182px] bg-[#21263f] rounded shadow-lg flex flex-col justify-center ">
//                   {/* Menu Items */}
//                   <div className="flex items-center py-2 px-4 gap-2 cursor-pointer hover:bg-gray-700">
//                     <img src="/img/Booking history.png" className="w-5 h-5" />
//                     <p className="text-[#c8cedd] text-sm font-normal ">
//                       Booking History
//                     </p>
//                   </div>
//                   <div className="flex items-center py-2 px-4 gap-2 cursor-pointer hover:bg-gray-700">
//                     <img src="/img/profile.png" className="w-5 h-5" />
//                     <p className="text-[#c8cedd] text-sm font-normal">
//                       Profile
//                     </p>
//                   </div>
//                   <div className="flex items-center pt-2 pb-2  px-4  gap-2 cursor-pointer hover:bg-gray-700 ">
//                     <img src="/img/reset password.png" className="w-5 h-5" />
//                     <p className="text-[#c8cedd] text-sm font-normal">
//                       Reset Password
//                     </p>
//                   </div>
//                   <hr className="border-t border-[#565f7e] mx-4 pb-2 mt-2 " />
//                   <div
//                     className="flex items-center  py-2 px-4 gap-2 cursor-pointer hover:bg-gray-700"
//                     onClick={toggleLogin}
//                   >
//                     <img src="/img/logout.png" className="w-5 h-5" />
//                     <p className="text-[#c8cedd] text-sm font-normal">
//                       Log out
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Dropdown Menu for Mobile */}
//       {showMobileMenu && ( // ใช้สถานะ showMobileMenu ควบคุม
//         <div className="absolute w-full top-[64px] sm:hidden lg:hidden bg-[#21263f] py-12 border border-[#21263f] bg-opacity-5 backdrop-blur-lg flex flex-col justify-center items-center">
//           <button className="px-4 py-2 text-white text-base font-normal rounded my-4">
//             Login
//           </button>
//           <button className="border border-[#8b93b0] w-[134px] h-[48px] text-white text-base font-bold rounded my-4 ">
//             Register
//           </button>
//         </div>
//       )}
//     </nav>
//   );
// }


import { useState } from "react";
import DropdownNavMenu from "./dropdownNavMenu";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const toggleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    setShowDropdown(false);
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);
  const toggleMobileMenu = () => setShowMobileMenu((prev) => !prev);

  return (
    <nav className="relative">
      {/* Background Blur */}
      <div
        className="absolute inset-x-0 top-0 h-16 lg:h-20 bg-black bg-opacity-5 backdrop-blur-lg w-full
        border-b-2 border-[#21263f]"
      ></div>

      <div className="relative flex justify-between items-center bg-transparent px-4 pt-2 lg:pt-[14px] lg:mx-14">
        {/* Logo */}
        <img src="/img/logo.png" alt="Logo" className="h-8" />

        {/* Mobile Menu Button */}
        <button
          className="rounded-sm border-none flex items-center justify-center mt-2 active:scale-95 transition-transform duration-150 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <img src="/img/Ham.png" alt="Menu" className="w-6 h-5 m-1" />
        </button>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-4">
          {!isLoggedIn ? (
            <>
              <button
                className="px-4 py-2 text-white text-base font-normal rounded"
                onClick={toggleLogin}
              >
                Login
              </button>
              <button className="w-[134px] h-[48px] text-white text-base font-bold rounded hover:border hover:border-[#8b93b0]">
                Register
              </button>
            </>
          ) : (
            <div className="relative top-1">
              <div
                className="flex items-center cursor-pointer "
                onClick={toggleDropdown}
              >
                <img
                  src="https://s3-alpha-sig.figma.com/img/10c3/32fe/6920a3869b17c5dfa8ac6d7883ce535d?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oVMqRicEIUcjMAzcq65TmJDS3~a3aM6pHoHE~YZqEZHTrcmHuaFRPDEyM3UrK7jxeEC0fk-9fEROCPXJF9AIoaVtaZxVLOiu4SpYDaQ-sGI2ZX45SEJapto-NwLJ9vKeLZQYwEKjBzS9wijXOid2oS2xZkWXfVvMWo91k3IKAnLIDYEYfio03wOUE0JYUqLbwfoVK~YZZfTLsgHqqQud1eYhyBEpi-Tq9VddtMbQrkiLmDN~ex1RR6Uu8MJDfm~qHgPH7itwTYSy9Y2TXBEyyXu-1rJfEIbvOCwQltN7h1jX4kJJRRgT0X5HHDq06hwIv~9U2ueWxzW9yB5H3YJhPQ__"
                  className="w-10 h-10 rounded-full object-cover mr-3"
                  alt="Profile"
                />
                <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
                  Bruce Wayne
                </span>
                <img src="/img/dropDown.png" alt="Dropdown Icon" />
              </div>

              {/* Dropdown Menu for Desktop */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 h-44 w-[182px] bg-[#21263f] rounded shadow-lg">
                  <DropdownNavMenu
                    toggleLogin={toggleLogin}
                    setShowMobileMenu={null}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div
          className="absolute w-screen top-[64px] sm:hidden lg:hidden bg-[#21263f]  border border-[#21263f] bg-opacity-5 backdrop-blur-lg flex flex-col 
          px-5
        "
        >
          {!isLoggedIn ? (
            <>
              <button
                className=" hover:border hover:border-[#8b93b0] text-white text-base font-normal rounded  mt-12 mb-12 py-4 mx-32 w-auto"
                onClick={() => {
                  toggleLogin();
                  setShowMobileMenu(false);
                }}
              >
                Login
              </button>
              <button className="hover:border hover:border-[#8b93b0] text-white text-base font-bold rounded my-4 mb-6  w-auto py-4 mx-32">
                Register
              </button>
            </>
          ) : (
            <DropdownNavMenu
              toggleLogin={toggleLogin}
              setShowMobileMenu={setShowMobileMenu}
            />
          )}
        </div>
      )}
    </nav>
  );
}
