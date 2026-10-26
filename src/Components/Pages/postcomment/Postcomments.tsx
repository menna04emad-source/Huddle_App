import { useComments, useCreateComment } from "../Commentsaction/Usecomments";
import { useParams } from "react-router-dom";

export default function PostComments() {
  const { id } = useParams<{ id: string }>();
  const postId = id ?? "";

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useComments(postId);

  const createComment = useCreateComment(postId);

  if (isLoading) {
    return <p>Loading comments...</p>;
  }

  if (isError) {
    return <p>Failed to load comments.</p>;
  }

  return (
    <section className="space-y-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();

          const form = event.currentTarget;
          const input = form.elements.namedItem(
            "content"
          ) as HTMLInputElement;

          const content = input.value.trim();

          if (!content) return;

          createComment.mutate(content, {
            onSuccess: () => form.reset(),
          });
        }}
        className="flex gap-2"
      >
        <input
          name="content"
          type="text"
          placeholder="Write a comment..."
          className="min-w-0 flex-1 rounded-lg border p-3"
          required
        />

        <button
          type="submit"
          disabled={createComment.isPending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {createComment.isPending ? "Posting..." : "Comment"}
        </button>
      </form>

      {createComment.isError && (
        <p className="text-sm text-red-500">
          Failed to create comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500">No comments yet.</p>
      ) : (
        comments.map((comment) => (
          <article
            key={comment._id}
            className="flex gap-3 rounded-xl bg-white p-4 shadow-sm"
          >
            <img
              src={comment.commentCreator.photo}
              alt={comment.commentCreator.name}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div>
              <h4 className="font-semibold">
                {comment.commentCreator.name}
              </h4>

              <p className="mt-1 text-sm text-gray-700">
                {comment.content}
              </p>
            </div>
          </article>
        ))
      )}
    </section>
  );
}