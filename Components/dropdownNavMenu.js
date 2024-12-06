export default function DropdownMenu({ toggleLogin, setShowMobileMenu }) {
  const handleItemClick = () => {
    if (setShowMobileMenu) setShowMobileMenu(false); // ตรวจสอบก่อนปิด Mobile Menu
  };

  return (
    <div className="flex flex-col py-16 lg:py-1 lg:mx-2">
      <div className="flex items-center cursor-pointer lg:hidden mb-5 ">
        <img
          src="https://s3-alpha-sig.figma.com/img/10c3/32fe/6920a3869b17c5dfa8ac6d7883ce535d?Expires=1734307200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oVMqRicEIUcjMAzcq65TmJDS3~a3aM6pHoHE~YZqEZHTrcmHuaFRPDEyM3UrK7jxeEC0fk-9fEROCPXJF9AIoaVtaZxVLOiu4SpYDaQ-sGI2ZX45SEJapto-NwLJ9vKeLZQYwEKjBzS9wijXOid2oS2xZkWXfVvMWo91k3IKAnLIDYEYfio03wOUE0JYUqLbwfoVK~YZZfTLsgHqqQud1eYhyBEpi-Tq9VddtMbQrkiLmDN~ex1RR6Uu8MJDfm~qHgPH7itwTYSy9Y2TXBEyyXu-1rJfEIbvOCwQltN7h1jX4kJJRRgT0X5HHDq06hwIv~9U2ueWxzW9yB5H3YJhPQ__"
          className="w-10 h-10 rounded-full object-cover mr-3"
          alt="Profile"
        />
        <span className="text-[#c8cedd] text-base font-normal ml-2 mr-3">
          Bruce Wayne
        </span>
      </div>

      <div
        className="flex items-center mt-2 py-2 lg:my-0 gap-2 cursor-pointer hover:bg-gray-700 mb-5"
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

      <div
        className="flex items-center pt-2 pb-2 lg:pb-0 gap-2 cursor-pointer hover:bg-gray-700  mb-5 "
        onClick={handleItemClick}
      >
        <img
          src="/img/reset password.png"
          className="w-5 h-5"
          alt="Reset Password"
        />
        <p className="text-[#c8cedd] text-sm font-normal">Reset Password</p>
      </div>

      <hr className="border-t border-[#565f7e]  pb-2 mt-2 lg:mt-0 lg:py-0" />

      <div
        className="flex items-center py-2 lg:mt-1 gap-2 cursor-pointer hover:bg-gray-700 mt-5"
        onClick={() => {
          toggleLogin();
          if (setShowMobileMenu) setShowMobileMenu(false);
        }}
      >
        <img src="/img/logout.png" className="w-5 h-5" alt="Logout" />
        <p className="text-[#c8cedd] text-sm font-normal">Log out</p>
      </div>
    </div>
  );
}
