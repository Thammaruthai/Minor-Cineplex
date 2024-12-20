export function StepsHeader({ currentStep }) {
  const steps = [
    { id: 1, label: "Select Showtime" },
    { id: 2, label: "Select Seat" },
    { id: 3, label: "Payment" },
  ];
  return (
    <div className="flex justify-center items-center mt-5 py-4 bg-[#070C1B] h-[100px] w-full relative z-40">
      <div className="flex gap-8 z-20 w-[468px] relative">
      <div className="absolute top-[30%] left-0 right-5 mx-auto h-0.5 bg-[#21263F] z-0 w-8/12" />
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex flex-col items-center w-[140px] gap-1.5 z-20"
          >
            <div
              className={`w-11 h-11 rounded-full flex items-center justify-center text-xl ${
                currentStep > step.id
                  ? "bg-[#1E29A8] text-white"
                  : step.id === currentStep
                  ? "bg-[#4E7BEE] text-white"
                  : "bg-none text-white border border-[#21263F]"
              }`}
            >
              {currentStep > step.id ? "✔" : step.id}
            </div>
            <span
              className={`${
                currentStep > step.id
                  ? " text-gray-400"
                  : "text-white"
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
