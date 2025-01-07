import React, { useState } from "react";

export default function CancellationPolicyModal  ({ isOpen, onClose })  {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex justify-center items-center"
      onClick={onClose} // Close modal when clicking outside
    >
      <div
        className="bg-gradient-to-r from-[#1E293B] to-[#0F172A] text-white rounded-lg shadow-2xl w-[600px] max-w-[95%] p-8 relative cursor-default"
        onClick={(e) => e.stopPropagation()} // Prevent click event from propagating
      >
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h2 className="text-2xl font-bold tracking-wide uppercase">
            Cancellation Policy
          </h2>          
        </div>

        {/* Policy Content */}
        <div className="space-y-4">
          <p className="text-[#C8CEDD] leading-relaxed">
            This Cancellation Policy outlines the terms and conditions under
            which customers may cancel their bookings and the corresponding
            refund eligibility. By proceeding with your booking, you agree to
            these terms as set forth by our company.
          </p>

          {/* Full Refund Clause */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Eligibility for Full Refund
            </h3>
            <p className="text-[#C8CEDD] leading-relaxed">
              A booking may qualify for a{" "}
              <span className="text-[#00C300] font-bold">100% refund</span> if
              the cancellation is submitted no later than{" "}
              <span className="text-white font-bold">1 hour prior</span> to the
              scheduled start time of the service/event. Requests submitted
              within this timeframe will be processed without penalty.
            </p>
          </div>

          {/* Partial Refund Clause */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Cancellation within 1 Hour
            </h3>
            <p className="text-[#C8CEDD] leading-relaxed">
              Cancellations made less than 1 hour before the scheduled start
              time are{" "}
              <span className="text-[#E5364B] font-bold">non-refundable</span>.
              Exceptions may be granted solely at the discretion of the
              management team in extraordinary circumstances.
            </p>
          </div>

          {/* Refund Process */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Refund Processing
            </h3>
            <p className="text-[#C8CEDD] leading-relaxed">
              Approved refunds will be credited back to the original payment
              method within 7–10 business days. Delays due to third-party
              payment processors or banks are beyond the control of our company.
            </p>
          </div>

          {/* Terms and Conditions */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">
              Additional Terms
            </h3>
            <ul className="list-disc list-inside text-[#C8CEDD] leading-relaxed">
              <li>
                The company reserves the right to modify this policy without
                prior notice.
              </li>
              <li>
                No refunds will be issued for unused portions of bookings or
                services.
              </li>
              <li>
                Any disputes will be resolved under the jurisdiction of the
                company’s registered location.
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-4">
         
          <button
            className="bg-[#4E7BEE] hover:bg-[#1E40AF] text-white px-6 py-2 rounded-lg text-sm font-bold"
            onClick={onClose}
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
};





