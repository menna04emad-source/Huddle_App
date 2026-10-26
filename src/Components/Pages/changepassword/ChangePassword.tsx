
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API = "https://route-posts.routemisr.com";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const token = localStorage.getItem("user Token");

    if (!token) {
      toast.error("Please log in first.");
      return;
    }

    if (password !== rePassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.patch(
        `${API}/users/change-password`,
        {
          currentPassword,
          password,
          rePassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Change password response:", response.data);

      toast.success(
        response.data?.message || "Password changed successfully."
      );

      setCurrentPassword("");
      setPassword("");
      setRePassword("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("Status:", error.response?.status);
        console.log(
          "Full API response:",
          error.response?.data
        );

        const message =
          error.response?.data?.message ||
          error.response?.data?.errors ||
          "Failed to change password.";

        toast.error(
          typeof message === "string"
            ? message
            : JSON.stringify(message)
        );
      } else {
        console.error(error);
        toast.error("Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
      <form
        onSubmit={handleChangePassword}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold text-gray-800">
          Change Password
        </h1>

        <div>
          <label
            htmlFor="currentPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Enter your new password"
          />
        </div>

        <div>
          <label
            htmlFor="rePassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="rePassword"
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            placeholder="Confirm your new password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}
