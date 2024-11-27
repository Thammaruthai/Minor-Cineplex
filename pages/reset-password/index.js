"use client";

import { Input } from "@chakra-ui/react";

export default function ResetPasswordForm() {
  return (
    <div className="min-h-screen bg-[#1a1b23]">
      <main className="mx-auto max-w-md px-4 pt-16">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Reset password
        </h1>
        <form className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="new-password"
              className="block text-sm text-gray-300"
            >
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="New password"
              variant="filled"
              bg="#21263F"
              borderColor="#565F7E"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm-password"
              className="block text-sm text-gray-300"
            >
              Confirm password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm new password"
              variant="filled"
              bg="#21263F"
              borderColor="#565F7E"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-[#4E7BEE] hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition duration-200"
          >
            Reset Password
          </button>
        </form>
      </main>
    </div>
  );
}
