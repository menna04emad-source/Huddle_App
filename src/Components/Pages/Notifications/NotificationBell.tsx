
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";

const API = "https://route-posts.routemisr.com";

export default function NotificationBell() {
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("user Token")}`,
          },
        }
      );

      return Number(
        data?.data?.count ??
          data?.data?.unreadCount ??
          data?.data?.unread ??
          data?.count ??
          0
      );
    },
    refetchInterval: 30000,
  });

  return (
    <Link
      to="/notifications"
      aria-label={`Notifications, ${unreadCount} unread`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
    >
      <FaBell className="text-xl" />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </Link>
  );
}
