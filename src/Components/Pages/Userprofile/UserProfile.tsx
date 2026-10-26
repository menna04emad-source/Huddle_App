
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";

import Post from "../Post/Post";
import Loader from "../../Loader/Loader";
import type { Post as PostType } from "../../../Schemas/post.type";

const API = "https://route-posts.routemisr.com";

export interface UserProfileType {
  _id: string;
  name: string;
  username: string;
  email?: string;
  photo?: string | null;
  dateOfBirth?: string;
  gender?: string;
  followers?: (string | { _id: string })[];
  following?: (string | { _id: string })[];
}

interface ProfileCacheType {
  _id?: string;
  user?: { _id: string };
}

const getToken = (): string | null =>
  localStorage.getItem("user Token");

const getId = (value: string | { _id: string }): string =>
  typeof value === "string" ? value : value._id;

export default function UserProfile() {
  const { id: routeUserId } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const token = getToken();

  const currentUser =
    queryClient.getQueryData<ProfileCacheType>(["profile"]);

  const currentUserId =
    currentUser?.user?._id ?? currentUser?._id;

  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
    error: profileError,
  } = useQuery<UserProfileType>({
    queryKey: ["user-profile", routeUserId],
    enabled: Boolean(routeUserId && token),
    queryFn: async () => {
      if (!routeUserId || !token) {
        throw new Error("User ID or authentication token is missing.");
      }

      const { data } = await axios.get(
        `${API}/users/${routeUserId}/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const profileData = data?.data?.user ?? data?.data;

      if (!profileData?._id) {
        throw new Error("Invalid user profile response.");
      }

      return profileData as UserProfileType;
    },
  });

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
  } = useQuery<PostType[]>({
    queryKey: ["user-posts", routeUserId],
    enabled: Boolean(routeUserId && token),
    queryFn: async () => {
      if (!routeUserId || !token) {
        throw new Error("User ID or authentication token is missing.");
      }

      const { data } = await axios.get(
        `${API}/users/${routeUserId}/posts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const postsData = data?.data?.posts ?? data?.data;

      return Array.isArray(postsData)
        ? (postsData as PostType[])
        : [];
    },
  });

  const isOwnProfile = Boolean(
    currentUserId &&
      user?._id &&
      String(currentUserId) === String(user._id)
  );

  const isFollowing = Boolean(
    currentUserId &&
      user?.followers?.some(
        (follower) => getId(follower) === String(currentUserId)
      )
  );

  const followMutation = useMutation({
    mutationFn: async () => {
      // Use the actual ID from the loaded profile.
      const targetUserId = user?._id;

      if (!targetUserId) {
        throw new Error("The profile user ID is missing.");
      }

      if (isOwnProfile) {
        throw new Error("You cannot follow your own profile.");
      }

      const authToken = getToken();

      if (!authToken) {
        throw new Error("Please log in first.");
      }

      // This endpoint must exist in the API for the request to succeed.
      const url = `${API}/users/${encodeURIComponent(targetUserId)}/follow`;

      console.log("Follow request:", {
        method: "POST",
        url,
        targetUserId,
      });

      const { data } = await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return data;
    },

    onSuccess: async (data) => {
      toast.success(data?.message || "Follow successful!");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["user-profile", routeUserId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["user-posts", routeUserId],
        }),
      ]);
    },

    onError: (error: unknown) => {
      let message = "Follow action failed.";

      if (axios.isAxiosError(error)) {
        message =
          error.response?.data?.message ||
          error.response?.data?.errors ||
          message;

        console.error("Follow status:", error.response?.status);
        console.error("Follow API response:", error.response?.data);
      } else if (error instanceof Error) {
        message = error.message;
      }

      toast.error(
        typeof message === "string"
          ? message
          : JSON.stringify(message)
      );
    },
  });

  if (!routeUserId) {
    return (
      <p className="p-6 text-center text-red-500">
        User ID is missing. Check the profile link.
      </p>
    );
  }

  if (!token) {
    return (
      <p className="p-6 text-center text-red-500">
        Please log in to view this profile.
      </p>
    );
  }

  if (userLoading) {
    return <Loader />;
  }

  if (userError || !user) {
    const message = axios.isAxiosError(profileError)
      ? profileError.response?.data?.message
      : profileError instanceof Error
        ? profileError.message
        : undefined;

    return (
      <p className="p-6 text-center text-red-500">
        {message || "Failed to load user profile."}
      </p>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-3xl bg-gray-50 px-4 py-8 dark:bg-gray-950">
      <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
        <div className="flex flex-wrap items-center gap-5">
          <img
            src={user.photo || "/default-avatar.png"}
            alt={`${user.name}'s profile`}
            onError={(event) => {
              event.currentTarget.src = "/default-avatar.png";
            }}
            className="h-20 w-20 rounded-full border-4 border-emerald-100 object-cover sm:h-24 sm:w-24"
          />

          <div className="min-w-0 flex-1">
            <h1 className="break-words text-2xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>

            <p className="mt-1 text-gray-500 dark:text-gray-400">
              @{user.username}
            </p>

            <div className="mt-4 flex flex-wrap gap-5 text-sm">
              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">
                  {user.followers?.length ?? 0}
                </span>{" "}
                followers
              </p>

              <p className="text-gray-600 dark:text-gray-300">
                <span className="font-bold text-gray-900 dark:text-white">
                  {user.following?.length ?? 0}
                </span>{" "}
                following
              </p>
            </div>
          </div>

          {!isOwnProfile && (
            <button
              type="button"
              disabled={followMutation.isPending}
              onClick={() => followMutation.mutate()}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isFollowing
                  ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                  : "bg-gradient-to-r from-emerald-400 to-fuchsia-500 text-white hover:opacity-90"
              }`}
            >
              {followMutation.isPending ? (
                <span>Loading...</span>
              ) : (
                <>
                  {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
                  {isFollowing ? "Following" : "Follow"}
                </>
              )}
            </button>
          )}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Posts
          </h2>

          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
            {posts.length} posts
          </span>
        </div>

        {postsLoading ? (
          <Loader />
        ) : postsError ? (
          <p className="rounded-xl bg-white p-6 text-center text-red-500 dark:bg-gray-900">
            Failed to load this user's posts.
          </p>
        ) : posts.length === 0 ? (
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              No posts yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              This user hasn't shared any posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                isMyPost={isOwnProfile}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
