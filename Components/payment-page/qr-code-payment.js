import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import axios from "axios";

export default function QrCodePayment() {
  const [clientSecret, setClientSecret] = useState(null); // State สำหรับเก็บข้อมูล clientSecret
  const [error, setError] = useState(null);

  const createPayment = async () => {
    try {
      const response = await axios.post("/api/payment/create-payment-qr-code", {
        amount: 1000, // จำนวนเงิน (10 บาท)
        currency: "thb", // สกุลเงิน
      });

      const data = response.data;
      console.log("data", data);

      console.log("Client Secret:", data.clientSecret);
      setClientSecret(data.clientSecret); // เก็บ clientSecret ใน state
      setError(null);
    } catch (error) {
      console.error("Error:", error.response?.data?.error || error.message);
      setError(error.response?.data?.error || error.message);
    }
  };

  return (
    <div className="flex-1 md:p-8 text-white">
      <h1>QR Code Payment</h1>
      <button
        className="bg-[#21263F] w-[900px] h-[50px] flex items-center justify-center hover:bg-[#32395b]"
        onClick={createPayment}
      >
        QR Code Payment
      </button>

      {/* แสดง Error ถ้ามี */}
      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {/* แสดง QR Code ถ้า clientSecret มีค่า */}
      {clientSecret && (
        <div className="mt-8">
          <p className="mb-4">สแกน QR Code เพื่อชำระเงิน:</p>
          <QRCodeSVG value={clientSecret} size={256} />
        </div>
      )}
      <p>{clientSecret}</p>
    </div>
  );
}
