import {
  FaRegHeart,
  FaRegComment,
  FaRegShareSquare,
  FaEllipsisH,
  FaArrowLeft,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

import Loader from "../../Loader/Loader";
import type { Post as PostType } from "../../../Schemas/post.type";
import type { Comment as PostComment } from "../../../Schemas/singlepost.type";

const API = "https://route-posts.routemisr.com";

export default function PostDetails() {
  const { id } = useParams<{ id: string }>();

  const token = localStorage.getItem("user Token");

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<PostType>({
    queryKey: ["getPostDetails", id],
    queryFn: async () => {
      const { data } = await axios.get(`${API}/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.data.post;
    },
    enabled: Boolean(id && token),
    retry: 1,
  });

  const {
    data: comments = [],
    isLoading: commentsLoading,
    isError: commentsError,
  } = useQuery<PostComment[]>({
    queryKey: ["comments", id],
    queryFn: async () => {
      const { data } = await axios.get(
        `${API}/posts/${id}/comments?page=1&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const commentsData = data.data.comments ?? data.data;

      return Array.isArray(commentsData) ? commentsData : [];
    },
    enabled: Boolean(id && token),
  });

  if (!id) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Post ID is missing.</p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-600">Please log in to view this post.</p>
        <Link
          to="/login"
          className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <p className="text-gray-600">Failed to load this post.</p>
        <Link
          to="/home"
          className="rounded-lg bg-orange-500 px-5 py-2 text-white hover:bg-orange-600"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const createdAt = new Date(post.createdAt);

  const formattedDate = createdAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = createdAt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const likesCount =
    "likesCount" in post && typeof post.likesCount === "number"
      ? post.likesCount
      : Array.isArray(post.likes)
        ? post.likes.length
        : 0;

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <Link
          to="/home"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-orange-500"
        >
          <FaArrowLeft />
          Back to posts
        </Link>

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Post Details
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            View the full post and join the conversation.
          </p>
        </div>

        {/* Main post */}
        <article className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between gap-3 p-5 sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={post.user.photo || "/default-avatar.png"}
                alt={post.user.name}
                className="h-12 w-12 shrink-0 rounded-full border border-gray-100 object-cover sm:h-14 sm:w-14"
              />

              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-gray-900 sm:text-lg">
                  {post.user.name}
                </h2>

                <p className="truncate text-sm text-gray-500">
                  @{post.user.username}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {formattedDate} · {formattedTime}
                </p>
              </div>
            </div>

            <button
              type="button"
              aria-label="More options"
              className="rounded-full p-3 text-gray-500 transition hover:bg-gray-100"
            >
              <FaEllipsisH />
            </button>
          </div>

          {/* Privacy */}
          <div className="px-5 pb-4 sm:px-6">
            <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-medium capitalize text-orange-600">
              {post.privacy}
            </span>
          </div>

          {/* Post text */}
          {post.body && (
            <div className="px-5 pb-6 sm:px-6">
              <p className="whitespace-pre-wrap break-words text-base leading-8 text-gray-800 sm:text-lg">
                {post.body}
              </p>
            </div>
          )}

          {/* Post image */}
          {post.image && (
            <div className="w-full overflow-hidden border-y border-gray-100 bg-gray-50">
              <img
                src={post.image}
                alt={`Post by ${post.user.name}`}
                className="mx-auto max-h-[700px] w-full object-contain"
              />
            </div>
          )}

          {/* Engagement counts */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-5 py-4 text-sm text-gray-500 sm:px-6">
            <span>
              <span className="font-semibold text-gray-800">
                {likesCount}
              </span>{" "}
              likes
            </span>

            <div className="flex flex-wrap gap-4">
              <span>{post.commentsCount ?? comments.length} comments</span>
              <span>{post.sharesCount ?? 0} shares</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2 p-3 sm:px-5">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-gray-600 transition hover:bg-rose-50 hover:text-rose-500"
            >
              <FaRegHeart className="text-base" />
              Like
            </button>

            <button
              type="button"
              onClick={() => {
                document.getElementById("top-comment")?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }}
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-gray-600 transition hover:bg-blue-50 hover:text-blue-500"
            >
              <FaRegComment className="text-base" />
              Comment
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator
                    .share({
                      title: `Post by ${post.user.name}`,
                      text: post.body || "Check out this post",
                      url: window.location.href,
                    })
                    .catch(() => {});
                } else {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .catch(() => {});
                }
              }}
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-sm text-gray-600 transition hover:bg-orange-50 hover:text-orange-500"
            >
              <FaRegShareSquare className="text-base" />
              Share
            </button>
          </div>

          {/* All comments */}
          <div
            id="top-comment"
            className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">All comments</h3>

              <span className="text-xs text-gray-400">
                {comments.length} comments loaded
              </span>
            </div>

            {commentsLoading ? (
              <p className="py-4 text-center text-sm text-gray-500">
                Loading comments...
              </p>
            ) : commentsError ? (
              <p className="py-4 text-center text-sm text-red-600">
                Failed to load comments. Please try again.
              </p>
            ) : comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <article
                    key={comment._id}
                    className="flex items-start gap-3"
                  >
                    <img
                      src={
                        comment.commentCreator.photo ||
                        "/default-avatar.png"
                      }
                      alt={comment.commentCreator.name}
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />

                    <div className="min-w-0 flex-1 rounded-2xl bg-white p-4 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {comment.commentCreator.name}
                      </h4>

                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                        {" · "}
                        {new Date(comment.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>

                      <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-gray-700">
                        {comment.content}
                      </p>

                      {comment.photo && (
                        <img
                          src={comment.photo}
                          alt="Comment attachment"
                          className="mt-3 max-h-80 rounded-xl object-contain"
                        />
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-white px-4 py-8 text-center">
                <FaRegComment className="mx-auto mb-3 text-2xl text-gray-300" />
                <p className="font-medium text-gray-700">No comments yet</p>
                <p className="mt-1 text-sm text-gray-400">
                  Start the conversation on this post.
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Author details */}
        <section className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            About the author
          </h3>

          <div className="flex items-center gap-4">
            <img
              src={post.user.photo || "/default-avatar.png"}
              alt={post.user.name}
              className="h-16 w-16 rounded-full object-cover"
            />

            <div>
              <h4 className="font-semibold text-gray-900">
                {post.user.name}
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                @{post.user.username}
              </p>

              <Link
                to={`/profile/${post.user._id}`}
                className="mt-2 inline-block text-sm font-medium text-orange-500 hover:text-orange-600"
              >
                View profile →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
