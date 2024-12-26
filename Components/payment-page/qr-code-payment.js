import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function QrCodePayment({ qrCodeUrl }) {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State สำหรับแสดงสถานะ loading

  return (
    <div className="flex-1 md:p-8 text-white">
      <h1>QR Code Payment</h1>
      <div className="bg-[#21263F] w-[900px] h-[50px] flex items-center justify-center">
        QR Code Payment
      </div>
    </div>
  );
}
