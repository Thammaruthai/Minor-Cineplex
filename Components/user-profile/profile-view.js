import { Input } from "@chakra-ui/react";

export default function ProfileView() {
  return (
    <div className="flex-1 p-8">
      <h1 className="text-4xl font-bold mb-2">Profile</h1>
      <p className="text-gray-400 mb-8">
        Keep your personal details private.
        <br />
        Information you add here is visible to anyone who can view your profile
      </p>

      <div className="max-w-md">
        <div className="mb-8 flex items-end gap-5">
          <div className="w-32 h-32 bg-gray-700 rounded-full mb-2 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <button className="underline font-bold">Upload</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-1 text-[#C8CEDD]">Name</label>
            <Input
              defaultValue="Bruce Wayne"
              bg="#21263F"
              className="text-white border border-[#565F7E] px-3"
            />
          </div>
          <div>
            <label className="block mb-1 text-[#C8CEDD]">Email</label>
            <Input
              defaultValue="iambatman@gmail.com"
              bg="#21263F"
              className="text-white border border-[#565F7E] px-3"
            />
          </div>
          <button className="mt-4 px-6 py-2 bg-transparent border border-gray-600 text-white rounded hover:bg-gray-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
