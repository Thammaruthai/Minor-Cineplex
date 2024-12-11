import { Input } from "@chakra-ui/react";

export default function ResetPasswordView() {
  return (
    <div>
      <h1 className="text-2xl mb-6">Reset password</h1>

      <div className="space-y-6 max-w-md">
        <div>
          <label className="block mb-2" htmlFor="new-password">
            New password
          </label>
          <Input
            id="new-password"
            type="password"
            placeholder="Enter new password"
            bg="gray.800"
            border="none"
            _focus={{ bg: "gray.700" }}
          />
        </div>

        <div>
          <label className="block mb-2" htmlFor="confirm-password">
            Confirm password
          </label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm new password"
            bg="gray.800"
            border="none"
            _focus={{ bg: "gray.700" }}
          />
        </div>

        <button className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
          Reset password
        </button>
      </div>
    </div>
  );
}
