// export default function Header() {
//   return (
//     <header>
//       <div class="bg-white h-12 opacity-5 relative blur"></div>
//       <div class="flex justify-between items-center p-2 px-4">
//         <img src="/img/logo.png" />
//         <img src="/img/Ham.png" class="w-6 h-5" />
//       </div>
//     </header>
//   );
// }

export default function Header() {
  return (
    <header className="relative mb-32 shadow-2xl ">
      <div className="absolute inset-x-0 top-0 h-14 bg-white bg-opacity-5 backdrop-blur-lg w-full"></div>

      <div className="relative flex justify-between items-center bg-transparent px-4 pt-2 lg:mx-10">
        <img src="/img/logo.png" alt="Logo" className="h-8" />
        <button class="rounded-sm border-none flex items-center justify-center mt-2 active:scale-95 transition-transform duration-150 lg:hidden">
          <img src="/img/Ham.png" alt="Menu" className="w-6 h-5 m-1 " />
        </button>

        <div class="hidden lg:flex space-x-4">
          <button class="px-4 py-2 border-none text-white rounded">
            Login
          </button>
          <button class="px-4 py-2 border-none text-white rounded">
            Register
          </button>
        </div>
      </div>
    </header>
  );
}
