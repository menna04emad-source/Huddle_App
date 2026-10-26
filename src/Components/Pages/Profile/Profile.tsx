import { useRef, useState, type ChangeEvent } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  FaCamera,
  FaRegCalendarAlt,
  FaRegUser,
  FaSyncAlt,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { toast } from "react-toastify";

import type { Post as PostType } from "../../../Schemas/post.type";
import Post from "../Post/Post";
import Loader from "../../Loader/Loader";
import CreatePost from "../Createpost/CreatePost";

const API = "https://route-posts.routemisr.com";

type ProfileUser = {
  _id: string;
  name: string;
  username: string;
  photo?: string | null;
};

type EditPostVariables = {
  postId: string;
  body: string;
};

function getToken(): string {
  const token = localStorage.getItem("user Token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return token;
}

function getAuthHeaders() {
  return {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  };
}

async function getProfile(): Promise<ProfileUser> {
  const { data } = await axios.get(
    `${API}/users/profile-data`,
    getAuthHeaders()
  );

  const user = data?.data?.user;

  if (!user?._id) {
    throw new Error("Profile data was not returned by the server.");
  }

  return user as ProfileUser;
}

async function getAllPosts(): Promise<PostType[]> {
  const { data } = await axios.get(
    `${API}/posts`,
    getAuthHeaders()
  );

  const posts = data?.data?.posts;

  return Array.isArray(posts) ? (posts as PostType[]) : [];
}

async function uploadPhoto(file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append("photo", file);

  const { data } = await axios.put(
    `${API}/users/upload-photo`,
    formData,
    getAuthHeaders()
  );

  return data;
}

async function editPost({
  postId,
  body,
}: EditPostVariables): Promise<unknown> {
  const { data } = await axios.put(
    `${API}/posts/${postId}`,
    { body },
    getAuthHeaders()
  );

  return data;
}

async function deletePost(postId: string): Promise<unknown> {
  const { data } = await axios.delete(
    `${API}/posts/${postId}`,
    getAuthHeaders()
  );

  return data;
}

function getErrorMessage(
  error: unknown,
  fallback: string
): string {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const message =
      responseData?.message ?? responseData?.errors;

    if (typeof message === "string") {
      return message;
    }

    if (message) {
      return JSON.stringify(message);
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

export default function Profile() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editingPostId, setEditingPostId] = useState<string | null>(
    null
  );
  const [editedBody, setEditedBody] = useState("");

  const {
    data: user,
    isLoading: profileLoading,
    isError: profileError,
    refetch: refetchProfile,
  } = useQuery<ProfileUser>({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const {
    data: posts = [],
    isLoading: postsLoading,
    isError: postsError,
    refetch: refetchPosts,
    isFetching: postsFetching,
  } = useQuery<PostType[]>({
    queryKey: ["getAllposts"],
    queryFn: getAllPosts,
  });

  const uploadPhotoMutation = useMutation<
    unknown,
    unknown,
    File
  >({
    mutationFn: uploadPhoto,
    onSuccess: async () => {
      toast.success("Profile photo updated successfully!");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["profile"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["getAllposts"],
        }),
      ]);
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Failed to upload profile photo.")
      );
    },
  });

  const editPostMutation = useMutation<
    unknown,
    unknown,
    EditPostVariables
  >({
    mutationFn: editPost,
    onSuccess: async () => {
      toast.success("Post updated successfully!");
      setEditingPostId(null);
      setEditedBody("");

      await queryClient.invalidateQueries({
        queryKey: ["getAllposts"],
      });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to edit post."));
    },
  });

  const deletePostMutation = useMutation<
    unknown,
    unknown,
    string
  >({
    mutationFn: deletePost,
    onSuccess: async () => {
      toast.success("Post deleted successfully!");

      await queryClient.invalidateQueries({
        queryKey: ["getAllposts"],
      });
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete post."));
    },
  });

  const handlePhotoChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5 MB.");
      event.target.value = "";
      return;
    }

    uploadPhotoMutation.mutate(file);
    event.target.value = "";
  };

  const startEditing = (post: PostType) => {
    setEditingPostId(post._id);
    setEditedBody(post.body ?? "");
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditedBody("");
  };

  const handleSaveEdit = (postId: string) => {
    if (!editedBody.trim()) {
      toast.error("Post text cannot be empty.");
      return;
    }

    editPostMutation.mutate({
      postId,
      body: editedBody.trim(),
    });
  };

  const handleDeletePost = (postId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (confirmed) {
      deletePostMutation.mutate(postId);
    }
  };

  if (profileLoading) {
    return <Loader />;
  }

  if (profileError || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="mb-4 text-red-600">
          Failed to load your profile.
        </p>

        <button
          type="button"
          onClick={() => void refetchProfile()}
          className="rounded-lg bg-emerald-500 px-5 py-2 text-white hover:bg-emerald-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  const myPosts = posts.filter(
    (post) => post.user?._id === user._id
  );

  // This works only if your PostType includes a bookmarked property.
  const savedPosts = posts.filter(
    (post) => post.bookmarked === true
  );

  const actionsDisabled =
    editPostMutation.isPending ||
    deletePostMutation.isPending;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 text-gray-900 dark:bg-gray-950 dark:text-white">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Profile header */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="h-32 bg-gradient-to-r from-emerald-300 to-fuchsia-500 sm:h-44" />

          <div className="px-5 pb-6 sm:px-8">
            <div className="-mt-14 flex flex-col gap-4 sm:-mt-16 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-4">
                <div className="relative">
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="h-28 w-28 rounded-full border-4 border-white bg-gray-100 object-cover shadow-md dark:border-gray-900 sm:h-32 sm:w-32"
                    />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-4xl font-bold text-emerald-700 shadow-md dark:border-gray-900 dark:bg-emerald-950 dark:text-emerald-300 sm:h-32 sm:w-32">
                      {user.name?.charAt(0).toUpperCase() || (
                        <FaRegUser />
                      )}
                    </div>
                  )}

                  <button
                    type="button"
                    title="Upload profile photo"
                    aria-label="Upload profile photo"
                    disabled={uploadPhotoMutation.isPending}
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white shadow hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <FaCamera />
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0 pb-2">
                  <h1 className="break-words text-2xl font-bold sm:text-3xl">
                    {user.name}
                  </h1>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadPhotoMutation.isPending}
                className="flex items-center gap-2 self-start rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50 sm:self-auto"
              >
                <FaCamera />
                {uploadPhotoMutation.isPending
                  ? "Uploading..."
                  : "Change Photo"}
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 border-t border-gray-100 pt-5 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <p className="flex items-center gap-2">
                <FaRegUser className="text-emerald-500" />
                {user.name}
              </p>

              <p className="flex items-center gap-2">
                <FaRegCalendarAlt className="text-emerald-500" />
                My Profile
              </p>
            </div>
          </div>
        </section>

        {/* Create post */}
        <section>
          <CreatePost />
        </section>

        {/* My posts */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                My Posts
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Posts you have shared
              </p>
            </div>

            <button
              type="button"
              onClick={() => void refetchPosts()}
              disabled={postsFetching}
              className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-100 disabled:opacity-50 dark:border-gray-800 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              <FaSyncAlt
                className={postsFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          {postsLoading ? (
            <Loader />
          ) : postsError ? (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-900 dark:bg-gray-900">
              <p className="mb-3 text-red-600">
                Failed to load posts.
              </p>

              <button
                type="button"
                onClick={() => void refetchPosts()}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
              >
                Try Again
              </button>
            </div>
          ) : myPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">
                You haven't shared any posts yet.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {myPosts.map((post) => {
                const isEditing = editingPostId === post._id;

                return (
                  <article
                    key={post._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                  >
                    {isEditing ? (
                      <div className="space-y-3">
                        <label
                          htmlFor={`edit-post-${post._id}`}
                          className="block text-sm font-medium"
                        >
                          Edit post text
                        </label>

                        <textarea
                          id={`edit-post-${post._id}`}
                          value={editedBody}
                          onChange={(event) =>
                            setEditedBody(event.target.value)
                          }
                          rows={4}
                          maxLength={5000}
                          className="w-full resize-y rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
                          placeholder="What's on your mind?"
                        />

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveEdit(post._id)
                            }
                            disabled={editPostMutation.isPending}
                            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50"
                          >
                            <FaSave />
                            {editPostMutation.isPending
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditing}
                            disabled={editPostMutation.isPending}
                            className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 disabled:opacity-50 dark:bg-gray-800 dark:text-white"
                          >
                            <FaTimes />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <Post
                        post={post}
                        isMyPost
                        onEdit={startEditing}
                        onDelete={handleDeletePost}
                        actionsDisabled={actionsDisabled}
                      />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Saved posts */}
        <section className="space-y-4">
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">
              Saved Posts
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Posts you have bookmarked
            </p>
          </div>

          {postsLoading ? (
            <Loader />
          ) : postsError ? (
            <div className="rounded-xl border border-red-200 bg-white p-6 text-center dark:border-red-900 dark:bg-gray-900">
              <p className="text-red-600">
                Failed to load saved posts.
              </p>
            </div>
          ) : savedPosts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-white px-5 py-10 text-center dark:border-gray-700 dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">
                No saved posts found.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {savedPosts.map((post) => (
                <Post
                  key={post._id}
                  post={post}
                  isMyPost={post.user?._id === user._id}
                  onEdit={startEditing}
                  onDelete={handleDeletePost}
                  actionsDisabled={actionsDisabled}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

