
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { FaBell, FaCheck, FaCheckDouble } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../Loader/Loader";

const API = "https://route-posts.routemisr.com";

type NotificationItem = {
  _id?: string;
  id?: string;
  message?: string;
  title?: string;
  body?: string;
  type?: string;
  isRead?: boolean;
  read?: boolean;
  readAt?: string | null;
  createdAt?: string;
  sender?: {
    name?: string;
    photo?: string | null;
  };
  user?: {
    name?: string;
    photo?: string | null;
  };
  entity?: {
    _id?: string;
    postId?: string;
  };
  post?: {
    _id?: string;
  };
  link?: string;
};

type NotificationResponse = {
  notifications: NotificationItem[];
  totalPages: number;
};

function getToken() {
  return localStorage.getItem("user Token");
}

async function getNotifications(page: number) {
  const { data } = await axios.get(`${API}/notifications`, {
    params: { unread: false, page, limit: 10 },
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const payload = data?.data;
  const items = Array.isArray(payload)
    ? payload
    : payload?.notifications ?? payload?.items ?? payload?.data ?? [];

  const totalPages =
    Number(data?.meta?.totalPages ?? payload?.pagination?.pages) || 1;

  return {
    notifications: items as NotificationItem[],
    totalPages,
  } satisfies NotificationResponse;
}

async function getUnreadCount() {
  const { data } = await axios.get(
    `${API}/notifications/unread-count`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
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
}

export default function Notifications() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const notificationsQuery = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getNotifications(page),
  });

  const unreadQuery = useQuery({
    queryKey: ["notifications-unread-count"],
    queryFn: getUnreadCount,
  });

  const markOneRead = useMutation({
    mutationFn: async (id: string) => {
      return axios.patch(
        `${API}/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({
          queryKey: ["notifications-unread-count"],
        }),
      ]);
    },
    onError: () => toast.error("Couldn't mark notification as read."),
  });

  const markAllRead = useMutation({
    mutationFn: async () => {
      return axios.patch(
        `${API}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    },
    onSuccess: async () => {
      toast.success("All notifications marked as read.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["notifications"] }),
        queryClient.invalidateQueries({
          queryKey: ["notifications-unread-count"],
        }),
      ]);
    },
    onError: () => toast.error("Couldn't mark all as read."),
  });

  if (notificationsQuery.isLoading) return <Loader />;

  if (notificationsQuery.isError) {
    return (
      <main className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-950">
        <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 text-center dark:bg-gray-900">
          <p className="mb-4 text-red-500">Couldn't load notifications.</p>
          <button
            onClick={() => void notificationsQuery.refetch()}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-white"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const notifications = notificationsQuery.data?.notifications ?? [];
  const totalPages = notificationsQuery.data?.totalPages ?? 1;

  const isRead = (item: NotificationItem) =>
    Boolean(item.isRead ?? item.read ?? item.readAt);

  const getNotificationId = (item: NotificationItem) =>
    item._id ?? item.id ?? "";

  const getPostId = (item: NotificationItem) =>
    item.post?._id ??
    item.entity?.postId ??
    item.entity?._id;

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 dark:bg-gray-950">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {unreadQuery.data ?? 0} unread
            </p>
          </div>

          <button
            type="button"
            onClick={() => markAllRead.mutate()}
            disabled={
              markAllRead.isPending || !(unreadQuery.data ?? 0)
            }
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
          >
            <FaCheckDouble />
            {markAllRead.isPending ? "Updating..." : "Mark all as read"}
          </button>
        </header>

        <section className="overflow-hidden rounded-2xl bg-white shadow-sm dark:bg-gray-900">
          {notifications.length === 0 ? (
            <div className="p-10 text-center">
              <FaBell className="mx-auto mb-3 text-3xl text-gray-400" />
              <p className="font-semibold text-gray-800 dark:text-white">
                No notifications yet
              </p>
              <p className="mt-1 text-sm text-gray-500">
                You'll see activity here when it happens.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {notifications.map((item, index) => {
                const id = getNotificationId(item);
                const read = isRead(item);
                const postId = getPostId(item);
                const destination =
                  item.link ||
                  (postId ? `/postdetails/${postId}` : undefined);

                const content =
                  item.message ??
                  item.body ??
                  item.title ??
                  "You have a new notification.";

                return (
                  <div
                    key={id || index}
                    className={`flex items-start gap-3 p-4 ${
                      read ? "" : "bg-emerald-50/70 dark:bg-emerald-950/20"
                    }`}
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
                      <FaBell />
                    </div>

                    <div className="min-w-0 flex-1">
                      {destination ? (
                        <Link
                          to={destination}
                          onClick={() => {
                            if (id && !read) markOneRead.mutate(id);
                          }}
                          className="break-words text-sm font-medium text-gray-800 hover:text-emerald-600 dark:text-gray-100"
                        >
                          {content}
                        </Link>
                      ) : (
                        <p className="break-words text-sm font-medium text-gray-800 dark:text-gray-100">
                          {content}
                        </p>
                      )}

                      {item.createdAt && (
                        <p className="mt-1 text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {!read && id && (
                      <button
                        type="button"
                        title="Mark as read"
                        aria-label="Mark as read"
                        onClick={() => markOneRead.mutate(id)}
                        disabled={markOneRead.isPending}
                        className="rounded-full p-2 text-emerald-600 hover:bg-emerald-100 disabled:opacity-50 dark:hover:bg-gray-800"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <div className="mt-5 flex items-center justify-between">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-white"
          >
            Previous
          </button>

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 disabled:opacity-40 dark:border-gray-700 dark:text-white"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
