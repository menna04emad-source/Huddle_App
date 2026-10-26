
import { useEffect, useState, type MouseEvent, type FormEvent, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaRegHeart,
  FaRegComment,
  FaRegShareSquare,
  FaEllipsisH,
  FaHeart,
  FaBookmark,
  FaRegBookmark,
} from "react-icons/fa";
import { toast } from "react-toastify";

import type { Post as PostType } from "../../../Schemas/post.type";
import Comments from "../Comments/Comments";
import { useEditPost, useDeletePost } from "./UsePostActions";
import { usePostActions } from "../PostActions/usePostActions";

type PostProps = {
  post: PostType;
  isMyPost?: boolean;
  onEdit?: (post: PostType) => void;
  onDelete?: (postId: string) => void;
  actionsDisabled?: boolean;
};

type ProfileCache = {
  _id?: string;
  user?: {
    _id: string;
  };
};

type BookmarkFields = {
  isBookmarked?: boolean;
  bookmarked?: boolean;
};

type SharedPostData = {
  _id?: string;
  body?: string | null;
  image?: string | null;
  user?: {
    _id?: string;
    name?: string;
    username?: string;
    photo?: string | null;
  } | null;
};

type PostWithShare = PostType & {
  sharedPost?: SharedPostData | string | null;
};

export default function Post({
  post,
  isMyPost: isMyPostProp,
  onEdit,
  onDelete,
  actionsDisabled = false,
}: PostProps) {
  const queryClient = useQueryClient();

  const profile = queryClient.getQueryData<ProfileCache>(["profile"]);
  const currentUserId = profile?.user?._id ?? profile?._id;

  const isMyPost =
    isMyPostProp ??
    Boolean(
      currentUserId &&
        String(currentUserId) === String(post.user?._id)
    );

  const likedByMe = Boolean(
    currentUserId &&
      post.likes?.some((id) => String(id) === String(currentUserId))
  );

  const bookmarkFields = post as PostType & BookmarkFields;
  const postWithShare = post as PostWithShare;

  const sharedPost =
    postWithShare.sharedPost &&
    typeof postWithShare.sharedPost === "object"
      ? postWithShare.sharedPost
      : null;

  const [isLiked, setIsLiked] = useState(likedByMe);
  const [isBookmarked, setIsBookmarked] = useState(
    Boolean(
      bookmarkFields.isBookmarked ??
        bookmarkFields.bookmarked ??
        false
    )
  );
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    setIsLiked(likedByMe);
  }, [likedByMe]);

  useEffect(() => {
    setIsBookmarked(
      Boolean(
        bookmarkFields.isBookmarked ??
          bookmarkFields.bookmarked ??
          false
      )
    );
  }, [bookmarkFields.isBookmarked, bookmarkFields.bookmarked]);

  const {
    likePost,
    bookmarkPost,
    sharePost,
    isLiking,
    isBookmarking,
    isSharing,
  } = usePostActions(post._id);

  const editPost = useEditPost();
  const deletePost = useDeletePost();

  const handleLike = () => {
    if (isLiking) return;

    likePost(undefined, {
      onSuccess: () => setIsLiked((previous) => !previous),
    });
  };

  const handleBookmark = () => {
    if (isBookmarking) return;

    const wasBookmarked = isBookmarked;

    bookmarkPost(undefined, {
      onSuccess: async () => {
        setIsBookmarked(!wasBookmarked);

        toast.success(
          wasBookmarked
            ? "Post removed from saved posts."
            : "Post saved successfully."
        );

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["getAllposts"] }),
          queryClient.invalidateQueries({ queryKey: ["profile"] }),
          queryClient.invalidateQueries({ queryKey: ["savedPosts"] }),
        ]);
      },
    });
  };

  const handleShare = () => {
    if (!isSharing) sharePost();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/postdetails/${post._id}`
      );
      toast.success("Post link copied!");
    } catch {
      toast.error("Couldn't copy the post link.");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(post._id);
      return;
    }

    toast.info(
      <div>
        <p className="mb-3">Are you sure you want to delete this post?</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              deletePost.mutate(post._id);
              toast.dismiss();
            }}
            className="rounded bg-red-500 px-3 py-1 text-white"
          >
            Yes, delete
          </button>
          <button
            type="button"
            onClick={() => toast.dismiss()}
            className="rounded bg-gray-300 px-3 py-1 text-black"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleEdit = (event: MouseEvent<HTMLButtonElement>) => {
    setShowOptions(false);

    if (onEdit) {
      onEdit(post);
      return;
    }

    const article = event.currentTarget.closest("article");
    const form = article?.querySelector<HTMLFormElement>(".edit-post-form");
    const display = article?.querySelector<HTMLElement>(".post-body");

    if (form && display) {
      form.classList.remove("hidden");
      display.classList.add("hidden");
    }
  };

  const handleCancelEdit = (event: MouseEvent<HTMLButtonElement>) => {
    const article = event.currentTarget.closest("article");

    article
      ?.querySelector<HTMLFormElement>(".edit-post-form")
      ?.classList.add("hidden");

    article
      ?.querySelector<HTMLElement>(".post-body")
      ?.classList.remove("hidden");
  };

  const handleSaveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const body = formData.get("body")?.toString().trim() ?? "";
    const selectedImage = formData.get("image");

    const image =
      selectedImage instanceof File && selectedImage.size > 0
        ? selectedImage
        : null;

    if (!body && !image && !post.image) {
      toast.error("Please enter some text or select an image.");
      return;
    }

    editPost.mutate(
      { postId: post._id, body, image },
      {
        onSuccess: () => {
          form.classList.add("hidden");
          form
            .closest("article")
            ?.querySelector(".post-body")
            ?.classList.remove("hidden");
        },
      }
    );
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    const form = event.currentTarget.closest("form");
    const preview = form?.querySelector<HTMLImageElement>(
      ".edit-image-preview"
    );
    const previewContainer = form?.querySelector<HTMLElement>(
      ".edit-image-container"
    );

    if (!file || !preview || !previewContainer) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      event.currentTarget.value = "";
      return;
    }

    preview.src = URL.createObjectURL(file);
    previewContainer.classList.remove("hidden");
  };

  const handleRemoveSelectedImage = (
    event: MouseEvent<HTMLButtonElement>
  ) => {
    const form = event.currentTarget.closest("form");
    const input = form?.querySelector<HTMLInputElement>(
      'input[name="image"]'
    );
    const previewContainer = form?.querySelector<HTMLElement>(
      ".edit-image-container"
    );
    const preview = form?.querySelector<HTMLImageElement>(
      ".edit-image-preview"
    );

    if (input) input.value = "";
    if (preview) preview.src = "";
    previewContainer?.classList.add("hidden");
  };

  const originalLikesCount = post.likes?.length ?? 0;
  const displayedLikesCount =
    originalLikesCount +
    (isLiked === likedByMe ? 0 : isLiked ? 1 : -1);

  return (
    <article className="mx-auto mb-6 w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Header and three-dots menu */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <img
            src={post.user?.photo || "/default-avatar.png"}
            alt={post.user?.name || "User"}
            className="h-11 w-11 shrink-0 rounded-full object-cover"
          />

          <div className="min-w-0">
            <h3 className="truncate font-semibold text-gray-900 dark:text-white">
              {post.user?.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              @{post.user?.username}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(post.createdAt).toLocaleDateString()} ·{" "}
              {new Date(post.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowOptions((previous) => !previous)}
            aria-label="Post options"
            aria-expanded={showOptions}
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FaEllipsisH />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-10 z-30 min-w-36 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {isMyPost ? (
                <>
                  <button
                    type="button"
                    disabled={actionsDisabled}
                    onClick={handleEdit}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    Edit post
                  </button>

                  <button
                    type="button"
                    disabled={actionsDisabled || deletePost.isPending}
                    onClick={() => {
                      setShowOptions(false);
                      handleDelete();
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50 dark:hover:bg-red-950"
                  >
                    Delete post
                  </button>
                </>
              ) : (
                <Link
                  to={`/postdetails/${post._id}`}
                  onClick={() => setShowOptions(false)}
                  className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  View Post
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post content */}
      <div className="post-body">
        {sharedPost ? (
          <div className="mt-3">
            {post.body?.trim() && (
              <p className="mb-3 whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                {post.body}
              </p>
            )}

            <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 p-3">
                <img
                  src={sharedPost.user?.photo || "/default-avatar.png"}
                  alt={sharedPost.user?.name || "Original author"}
                  className="h-10 w-10 rounded-full bg-gray-100 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-semibold text-gray-900 dark:text-white">
                    {sharedPost.user?.name || "Original author"}
                  </p>
                  {sharedPost.user?.username && (
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                      @{sharedPost.user.username}
                    </p>
                  )}
                </div>
              </div>

              {sharedPost.body && (
                <p className="whitespace-pre-wrap break-words px-3 pb-3 text-gray-800 dark:text-gray-200">
                  {sharedPost.body}
                </p>
              )}

              {sharedPost.image && (
                <img
                  src={sharedPost.image}
                  alt="Original post"
                  className="max-h-[500px] w-full object-contain"
                />
              )}

              {!sharedPost.body && !sharedPost.image && (
                <p className="px-3 pb-3 text-sm text-gray-500 dark:text-gray-400">
                  The original post content is unavailable.
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            {post.body && (
              <p className="mb-3 whitespace-pre-wrap break-words text-gray-800 dark:text-gray-200">
                {post.body}
              </p>
            )}

            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="max-h-[500px] w-full rounded-xl object-cover"
              />
            )}
          </>
        )}
      </div>

      {/* Inline edit form is used when no parent onEdit callback is supplied */}
      {isMyPost && !onEdit && (
        <form
          className="edit-post-form hidden space-y-3"
          onSubmit={handleSaveEdit}
        >
          <textarea
            name="body"
            defaultValue={post.body ?? ""}
            rows={4}
            placeholder="What's on your mind?"
            className="w-full resize-y rounded-xl border border-gray-300 bg-gray-50 p-3 text-gray-900 outline-none focus:border-emerald-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />

          {post.image && (
            <p className="text-xs text-gray-500">
              Leaving the image field empty keeps the existing image.
            </p>
          )}

          <label className="block cursor-pointer rounded-lg border border-dashed border-gray-300 p-3 text-center text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
            <span>Choose an image</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2 block w-full text-sm"
            />
          </label>

          <div className="edit-image-container relative hidden">
            <img
              src=""
              alt="Selected image preview"
              className="edit-image-preview max-h-64 w-full rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveSelectedImage}
              className="absolute right-2 top-2 rounded-full bg-black/70 px-3 py-1 text-sm text-white hover:bg-black"
            >
              Remove image
            </button>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleCancelEdit}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-800"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={editPost.isPending}
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editPost.isPending ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      )}

      {/* Post statistics */}
      <div className="mt-4 flex items-center justify-between border-y border-gray-200 py-3 text-sm text-gray-500 dark:border-gray-700">
        <span>{Math.max(0, displayedLikesCount)} likes</span>
        <span>
          {post.commentsCount ?? 0} comments · {post.sharesCount ?? 0} shares
        </span>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-4 gap-1 py-2">
        <button
          type="button"
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800 ${
            isLiked ? "text-red-500" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />}
          <span>{isLiking ? "..." : isLiked ? "Liked" : "Like"}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowComments((previous) => !previous)}
          className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FaRegComment />
          <span>Comment</span>
        </button>

        <button
          type="button"
          onClick={handleBookmark}
          disabled={isBookmarking}
          className={`flex items-center justify-center gap-2 rounded-lg py-2 text-sm transition hover:bg-gray-100 disabled:opacity-50 dark:hover:bg-gray-800 ${
            isBookmarked
              ? "text-emerald-600"
              : "text-gray-600 dark:text-gray-300"
          }`}
        >
          {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
          <span>
            {isBookmarking ? "..." : isBookmarked ? "Saved" : "Save"}
          </span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className="flex items-center justify-center gap-2 rounded-lg py-2 text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <FaRegShareSquare />
          <span>{isSharing ? "Sharing..." : "Share"}</span>
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-lg px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50 dark:hover:bg-gray-800"
        >
          Copy post link
        </button>
      </div>

      {/* Top comment */}
      {post.topComment && (
        <div className="mt-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-800">
          <p className="mb-1 text-xs font-semibold text-gray-500">
            Top comment
          </p>
          <p className="text-sm text-gray-800 dark:text-gray-200">
            {typeof post.topComment === "string"
              ? post.topComment
              : post.topComment.content}
          </p>
        </div>
      )}

      {/* Comments */}
      {showComments && (
        <Comments
          postId={post._id}
          TopComment={post.topComment}
          onClose={() => setShowComments(false)}
        />
      )}
    </article>
  );
}
