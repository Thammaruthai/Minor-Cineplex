import { useState } from "react";


export default function LoadingPage() {
  const [loadingText, setLoadingText] = useState("Loading, please wait.");

  return (
    <div className="p-6 text-[#C8CEDD] rounded-lg w-[691px]">
      <h2 className="text-2xl font-bold mb-6">Booking history</h2>
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-white gap-4">
          <div className="w-16 h-16 border-4 border-blue-500 border-solid rounded-full border-t-transparent animate-spin"></div>
          <p className="animate-pulse">{loadingText}</p>
        </div>
      </div>
    </div>
  );
}
