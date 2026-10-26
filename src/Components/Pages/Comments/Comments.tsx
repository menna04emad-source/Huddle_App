import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FaTimes,
  FaRegComment,
  FaReply,
  FaHeart,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

import type { Comment as CommentType } from "../../../Schemas/singlepost.type";

import {
  useComments,
  useCreateComment,
  useCommentReplies,
  useCreateReply,
  useDeleteComment,
  useToggleCommentLike,
  useUpdateComment,
} from "../Commentsaction/Usecomments";
import { toast } from "react-toastify";
import type { TopComment as TopCommentType } from "../../../Schemas/post.type";

type CommentsProps = {
  postId: string;
  TopComment: TopCommentType | null;
  onClose: () => void;
};



type CommentItemProps = {
  postId: string;
  comment: CommentType;
};

function CommentItem({ postId, comment }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content ?? "");
  const [editing, setEditing] = useState(false);

  const queryClient = useQueryClient();
  const commentId = comment._id;

  const {
    data: replies = [],
    isLoading: repliesLoading,
    isError: repliesError,
  } = useCommentReplies(postId, commentId);

  const createReply = useCreateReply(postId, commentId);
  const updateComment = useUpdateComment(postId, commentId);
  const deleteComment = useDeleteComment(postId, commentId);
  const toggleLike = useToggleCommentLike(postId, commentId);

  const refreshComments = () => {
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });

    queryClient.invalidateQueries({
      queryKey: ["getPostDetails", postId],
    });
  };

  const handleReply = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = replyText.trim();
    if (!content) return;

    createReply.mutate(content, {
      onSuccess: () => {
        setReplyText("");
        setShowReplies(true);
        refreshComments();
      },
    });
  };

  const handleEdit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = editText.trim();
    if (!content) return;

    updateComment.mutate(content, {
      onSuccess: () => {
        setEditing(false);
        refreshComments();
      },
    });
  };

const handleDelete = () => {
  const toastId = toast.info(
    <div>
      <p className="mb-3 font-semibold">
        Are you sure you want to delete this comment?
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => {
            toast.dismiss(toastId);
            deleteComment.mutate(undefined);
          }}
          className="rounded bg-red-600 px-3 py-1 text-white"
        >
          Confirm
        </button>

        <button
          onClick={() => toast.dismiss(toastId)}
          className="rounded bg-gray-300 px-3 py-1 text-gray-800"
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

  const creator = comment.commentCreator;

  return (
    <div className="border-b border-gray-100 px-4 py-4 last:border-b-0">
      <div className="flex items-start gap-3">
        <img
          src={creator?.photo || "/default-avatar.png"}
          alt={creator?.name || "User"}
          className="h-10 w-10 shrink-0 rounded-full bg-gray-100 object-cover"
        />

        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-gray-100 px-4 py-3">
            <p className="font-semibold text-gray-900">
              {creator?.name || "User"}
            </p>

            {editing ? (
              <form onSubmit={handleEdit} className="mt-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-300 bg-white p-3 text-sm outline-none focus:border-blue-500"
                  placeholder="Edit your comment..."
                />

                {updateComment.isError && (
                  <p className="mt-1 text-xs text-red-600">
                    Could not update comment. Please try again.
                  </p>
                )}

                <div className="mt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={!editText.trim() || updateComment.isPending}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white disabled:opacity-50"
                  >
                    {updateComment.isPending ? "Saving..." : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditText(comment.content ?? "");
                      setEditing(false);
                    }}
                    className="rounded-lg bg-gray-200 px-3 py-1.5 text-sm text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                {comment.content}
              </p>
            )}
          </div>

          {comment.image && (
            <img
              src={comment.image}
              alt="Comment attachment"
              className="mt-2 max-h-64 rounded-xl object-cover"
            />
          )}

          <div className="mt-2 flex flex-wrap items-center gap-4 px-2 text-xs font-semibold text-gray-500">
            <button
              type="button"
              onClick={() => toggleLike.mutate()}
              disabled={toggleLike.isPending}
              className="flex items-center gap-1 hover:text-red-500 disabled:opacity-50"
            >
              <FaHeart />
              {toggleLike.isPending ? "Liking..." : "Like"}
            </button>

            <button
              type="button"
              onClick={() => setShowReplies((prev) => !prev)}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <FaReply />
              Reply
            </button>

            <button
              type="button"
              onClick={() => {
                setEditText(comment.content ?? "");
                setEditing(true);
              }}
              className="flex items-center gap-1 hover:text-blue-600"
            >
              <FaEdit />
              Edit
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteComment.isPending}
              className="flex items-center gap-1 hover:text-red-600 disabled:opacity-50"
            >
              <FaTrash />
              {deleteComment.isPending ? "Deleting..." : "Delete"}
            </button>
          </div>

          {(toggleLike.isError || deleteComment.isError) && (
            <p className="mt-2 px-2 text-xs text-red-600">
              Action failed. Please try again.
            </p>
          )}

          {showReplies && (
            <div className="mt-3">
              <form onSubmit={handleReply} className="flex gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
                />

                <button
                  type="submit"
                  disabled={!replyText.trim() || createReply.isPending}
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {createReply.isPending ? "Sending..." : "Send"}
                </button>
              </form>

              {createReply.isError && (
                <p className="mt-2 text-xs text-red-600">
                  Could not send reply. Please try again.
                </p>
              )}

              {repliesLoading ? (
                <p className="mt-3 text-sm text-gray-500">Loading replies...</p>
              ) : repliesError ? (
                <p className="mt-3 text-sm text-red-600">
                  Could not load replies.
                </p>
              ) : replies.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">No replies yet.</p>
              ) : (
                <div className="mt-3 space-y-3 border-l-2 border-gray-200 pl-3">
                  {replies.map((reply) => (
                    <div key={reply._id} className="rounded-xl bg-gray-50 p-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {reply.commentCreator?.name || "User"}
                      </p>

                      <p className="mt-1 whitespace-pre-wrap break-words text-sm text-gray-700">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Comments({ postId, onClose }: CommentsProps) {
  const { data: comments = [], isLoading, isError } = useComments(postId);

  const createComment = useCreateComment(postId);
  const [newComment, setNewComment] = useState("");

  const handleAddComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const content = newComment.trim();
    if (!content) return;

    createComment.mutate(content, {
      onSuccess: () => {
        setNewComment("");
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-5">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <FaRegComment className="text-blue-600" />

            <h2 className="text-lg font-bold text-gray-900">Comments</h2>

            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
              {comments.length}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close comments"
            className="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <FaTimes />
          </button>
        </div>

        <form
          onSubmit={handleAddComment}
          className="flex gap-2 border-b border-gray-200 bg-white p-4"
        >
          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="min-w-0 flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={!newComment.trim() || createComment.isPending}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createComment.isPending ? "Posting..." : "Post"}
          </button>
        </form>

        {createComment.isError && (
          <p className="bg-white px-4 py-2 text-sm text-red-600">
            Could not add comment. Please try again.
          </p>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-6 text-center text-sm text-gray-500">
              Loading comments...
            </p>
          ) : isError ? (
            <p className="p-6 text-center text-sm text-red-600">
              Could not load comments. Please try again.
            </p>
          ) : comments.length === 0 ? (
            <div className="p-8 text-center">
              <FaRegComment className="mx-auto mb-3 text-3xl text-gray-300" />

              <p className="font-semibold text-gray-700">No comments yet</p>

              <p className="mt-1 text-sm text-gray-500">
                Be the first to leave a comment.
              </p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment._id}
                postId={postId}
                comment={comment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
