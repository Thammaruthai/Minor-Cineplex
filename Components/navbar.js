export default function Navbar() {
  return (
    <header className="relative shadow-2xl ">
      <div className="absolute inset-x-0 top-0 h-16 bg-black bg-opacity-40 backdrop-blur-lg w-full"></div>

      <div className="relative flex justify-between items-center bg-transparent px-4 pt-2 lg:pt-[14px] lg:mx-14">
        <img src="/img/logo.png" alt="Logo" className="h-8" />
        <button className="rounded-sm border-none flex items-center justify-center mt-2 active:scale-95 transition-transform duration-150 lg:hidden">
          <img src="/img/Ham.png" alt="Menu" className="w-6 h-5 m-1 " />
        </button>

        <div className="hidden lg:flex space-x-4">
          <button className="px-4 py-2  text-white text-base font-normal rounded">
            Login
          </button>
          <button className="border-[2px] border-[#8b93b0] w-[134px] h-[48px] text-white text-base font-bold rounded ">
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
