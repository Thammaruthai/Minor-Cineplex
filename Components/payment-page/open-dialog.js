import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";
import { usePayment } from "@/hooks/usePayment";
import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBooking } from "@/hooks/useBooking";

export function ConfirmDialog({ isOpen, onClose, handleSubmit }) {
  const router = useRouter();
  const { payment } = usePayment();
  const currentPayment = payment[0];

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} placement="center">
      <DialogContent className="bg-[#21263F] flex gap-0 justify-center items-center w-[343px] h-[174px] border border-[#565F7E]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Confirm booking
          </DialogTitle>
          <DialogCloseTrigger className="text-[#C8CEDD] mt-2">
            <svg
              className="h-6 w-6"
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
          </DialogCloseTrigger>
        </DialogHeader>
        <DialogBody className="-mt-1">
          <p className="text-[#BAB9BD]">Confirm booking and payment?</p>
        </DialogBody>
        <DialogFooter className="-mt-4 mb-3">
          <DialogActionTrigger asChild>
            <Button
              variant="outline"
              className="text-white px-10 border border-[#8B93B0] font-bold"
            >
              Cancel
            </Button>
          </DialogActionTrigger>
          <Button
            onClick={(e) => {
              handleSubmit(e);
              onClose();
              if (currentPayment?.temp_payment_uuid) {
                router.push(
                  `/payments/payment-detail/${currentPayment.temp_payment_uuid}`
                );
              }
            }}
            className="text-white bg-[#4E7BEE] px-10 font-bold"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}

export function ExpiredDialog({ isOpen, onClose, setIsTimeout }) {
  const router = useRouter();
  const { booking } = useBooking();

  return (
    <DialogRoot open={isOpen} onOpenChange={onClose} placement="center">
      <DialogContent className="bg-[#21263F] flex gap-0 justify-center items-center w-[360px] h-[174px] border border-[#565F7E]">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold">
            Booking expired
          </DialogTitle>
          <DialogCloseTrigger className="text-[#C8CEDD]">
            <svg
              className="h-6 w-6"
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
          </DialogCloseTrigger>
        </DialogHeader>
        <DialogBody className="-mt-1 w-full px-4">
          <p className="text-[#BAB9BD] text-center w-[330px] text-sm">
            You did not complete the checkout process in time,
            <br /> please start again
          </p>
        </DialogBody>
        <DialogFooter className="-mt-4 mb-3">
          <DialogActionTrigger asChild>
            <Button
              onClick={() => {
                setIsTimeout(false);
                router.push(`/booking/${booking.show_id}`); 
              }}
              variant="outline"
              className="text-white px-10 border border-[#8B93B0] font-bold bg-[#4E7BEE] w-full"
            >
              OK
            </Button>
          </DialogActionTrigger>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  );
}
