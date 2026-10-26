import type { Comment as CommentType } from "../../../Schemas/singlepost.type";
import {
  useCommentReplies,
  useCreateReply,
  useDeleteComment,
  useToggleCommentLike,
  useUpdateComment,
} from "../Commentsaction/Usecomments";

type CommentItemProps = {
  postId: string;
  comment: CommentType;
};

export default function CommentAction({
  postId,
  comment,
}: CommentItemProps) {
  const commentId = comment._id;

  const { data: replies = [], isLoading } = useCommentReplies(
    postId,
    commentId
  );

  const createReply = useCreateReply(postId, commentId);
  const updateComment = useUpdateComment(postId, commentId);
  const deleteComment = useDeleteComment(postId, commentId);
  const toggleLike = useToggleCommentLike(postId, commentId);

  return (
    <div className="border-b border-gray-200 p-3">
      <p>{comment.content}</p>

      <button
        onClick={() => createReply.mutate("My reply")}
        disabled={createReply.isPending}
      >
        Reply
      </button>

      <button
        onClick={() => updateComment.mutate("Updated comment")}
        disabled={updateComment.isPending}
      >
        Edit
      </button>

      <button
        onClick={() => deleteComment.mutate()}
        disabled={deleteComment.isPending}
      >
        Delete
      </button>

      <button
        onClick={() => toggleLike.mutate()}
        disabled={toggleLike.isPending}
      >
        Like
      </button>

      {isLoading ? (
        <p>Loading replies...</p>
      ) : (
        replies.map((reply) => (
          <p key={reply._id} className="ml-4">
            {reply.content}
          </p>
        ))
      )}
    </div>
  );
}