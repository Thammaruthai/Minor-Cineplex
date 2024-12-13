import { useState } from "react";
import ProfileView from "@/Components/user-profile/profile-view";
import ResetPasswordView from "@/Components/user-profile/reset-password-view";

export default function Profile() {
  const [activeView, setActiveView] = useState("profile");
  return (
    <div className="text-white">
      <div className="mx-auto max-w-4xl">
        <div className="flex">
          {/* Sidebar */}
          <div className="mt-10 bg-[#070C1B] h-[50%] drop-shadow-lg font-bold text-[#C8CEDD]">
            <div className="p-4 space-y-2 flex flex-col">
              <button className=" text-left py-2 px-4 rounded">
                <div className="flex items-between gap-4">Booking History</div>
              </button>
              <button
                className={`text-left py-2 px-4 rounded ${
                  activeView === "profile"
                    ? "bg-[#21263F]"
                    : "hover:bg-[#21263F]"
                }`}
                onClick={() => setActiveView("profile")}
              >
                <div className="flex items-center gap-4">Profile</div>
              </button>
              <button
                className={`text-left py-2 px-4 rounded ${
                  activeView === "reset-password"
                    ? "bg-[#21263F]"
                    : "hover:bg-[#21263F]"
                }`}
                onClick={() => setActiveView("reset-password")}
              >
                <div className="flex items-center gap-4">Reset password</div>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-4 md:p-8">
            {activeView === "profile" ? <ProfileView /> : <ResetPasswordView />}
          </div>
        </div>
      </div>
    </div>
  );
}
