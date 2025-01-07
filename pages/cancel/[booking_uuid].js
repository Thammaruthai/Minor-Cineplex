import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Register() {
  const [success, setSuccess] = useState(false);




  
  const router = useRouter();
  const { booking_uuid } = router.query;
  if (1) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 text-white h-screen bg-slate-900 min-h-[640px] min-w-[300px] animate-fade-in font-robotoCondensed ">
        <div className="flex flex-col gap-6 w-[386px] rounded-lg text-center max-sm:w-11/12 animate-scale-up">
          <div className="flex flex-col items-center justify-center ">
            <div className="flex flex-col items-center justify-center w-[80px] h-[80px] rounded-full text-5xl text-white bg-[#00A372] animate-bounce">
              ✔
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-semibold">Cancellation successful</h1>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-400">
                The cancellation is complete.
              </p>
              <p className="text-sm text-gray-400">
                You will receive an email with a detail and refund within 48
                hours.
              </p>
            </div>
            <div className="flex justify-center gap-1">
              <span>Total Refund</span>
              <span className="font-bold ">THB 0.00</span>
            </div>
          </div>
          <button
            className="bg-[#4E7BEE] w-full py-3 mt-4 hover:bg-[#1E29A8]"
            onClick={() => {router.push(`/`);}}
          >
            {"Back to home"}
          </button>
        </div>
      </div>
    );
  }

  return;
}
