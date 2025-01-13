import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { usePayment } from "@/hooks/usePayment";
import { useBooking } from "@/hooks/useBooking";

export function ConfirmDialog({ isOpen, onClose, handleSubmit }) {
  const router = useRouter();
  const { payment } = usePayment();
  const currentPayment = payment[0];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-[#21263F] px-6 rounded-lg shadow-lg border border-[#565F7E] w-[343px] h-[174px] flex flex-col justify-center items-center">
        <div className="flex w-full justify-between items-center">
          <div className="w-full ml-7">
            <h1 className="text-white text-xl font-bold text-center">
              Confirm booking
            </h1>
          </div>
          <div className="flex w-6">
            <svg
              className="h-6 w-6 cursor-pointer"
              onClick={onClose}
              stroke="currentColor"
              fill="none"
              strokeWidth="1"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </div>
        </div>
        <p className="mt-4 text-[#BAB9BD] text-sm">Confirm booking and payment?</p>
        <div className="mt-4 flex justify-center gap-4">
          <Button
            className="text-white px-10 border h-11 border-[#8B93B0] font-bold hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="text-white bg-[#4E7BEE] h-11 px-10 font-bold hover:bg-blue-600"
            onClick={(e) => {
              handleSubmit(e);
              onClose();
              if (currentPayment?.temp_payment_uuid) {
                router.push(
                  `/payments/payment-detail/${currentPayment.temp_payment_uuid}`
                );
              }
            }}
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ExpiredDialog({ isOpen, onClose, setIsTimeout }) {
  const router = useRouter();
  const { booking } = useBooking();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
    >
      <div className="bg-[#21263F] px-4 rounded-lg shadow-lg border border-[#565F7E] w-[360px] h-[174px] flex flex-col justify-center items-center">
        <div className="flex w-full justify-between items-center">
          <div className="w-full ml-7">
            <h1 className="text-white text-xl font-bold text-center">
              Booking expired
            </h1>
          </div>
          <div className="flex w-6">
            <svg
              className="h-6 w-6 cursor-pointer"
              onClick={onClose}
              stroke="currentColor"
              fill="none"
              strokeWidth="1"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </div>
        </div>
        <p className="mt-4 text-[#BAB9BD] text-sm text-center">
          You did not complete the checkout process in time,
          <br /> please start again.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Button
            className="text-white px-10 border border-[#8B93B0] font-bold bg-[#4E7BEE] w-full"
            onClick={() => {
              setIsTimeout(false);
              router.push(`/booking/${booking.show_id}`);
            }}
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
