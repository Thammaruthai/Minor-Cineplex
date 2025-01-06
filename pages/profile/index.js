import { useState, useEffect } from "react";
import ProfileView from "@/Components/user-profile/profile-view";
import ResetPasswordView from "@/Components/user-profile/reset-password-view";
import BookingHistory from "@/Components/booking-history/history-list";
import Image from "next/image";
import { useRouter } from "next/router";
export default function Profile() {
  const [activeView, setActiveView] = useState("profile");
  const router = useRouter();
  const { view } = router.query;

  useEffect(() => {
    if (view === "booking-history") setActiveView("booking-history");
    else if (view === "reset-password") setActiveView("reset-password");
    else setActiveView("profile");
  }, [view]);

  return (
    <div className="text-white">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row w-full">
          {/* Sidebar */}
          <div
            className="mt-10 bg-[#070C1B] md:h-52 md:w-72 md:drop-shadow-lg font-bold text-[#C8CEDD]
            overflow-x-auto md:overflow-hidden whitespace-nowrap flex-row md:flex-col"
          >
            <div className="px-2 py-2 flex md:flex-col md:gap-3">
              <button
                className={`text-left py-4 pl-2 pr-9 rounded flex items-center gap-2 ${
                  activeView === "booking-history"
                    ? "bg-[#21263F]"
                    : "hover:bg-[#21263F]"
                }`}
                onClick={() => setActiveView("booking-history")}
              >
                <Image
                  src="/img/menu/notebook_light.png"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  alt="Booking Icon"
                />
                Booking History
              </button>
              <button
                className={`text-left py-4 pl-2 pr-9 rounded flex items-center gap-2 ${
                  activeView === "profile"
                    ? "bg-[#21263F]"
                    : "hover:bg-[#21263F]"
                }`}
                onClick={() => setActiveView("profile")}
              >
                <Image
                  src="/img/menu/User_duotone.png"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  alt="User Icon"
                />
                Profile
              </button>
              <button
                className={`text-left py-4 pl-2 pr-9 rounded flex items-center gap-2 ${
                  activeView === "reset-password"
                    ? "bg-[#21263F]"
                    : "hover:bg-[#21263F]"
                }`}
                onClick={() => setActiveView("reset-password")}
              >
                <Image
                  src="/img/menu/Refresh_light.png"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  alt="Reset Password Icon"
                />
                Reset password
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`${activeView === "booking-history" ? 'p-0 ': 'p-4'} md:p-8 w-full md:mt-0 mt-6`}
          >
            {activeView === "profile" ? (
              <ProfileView />
            ) : activeView === "reset-password" ? (
              <ResetPasswordView />
            ) : activeView === "booking-history" ? (
              <BookingHistory />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
