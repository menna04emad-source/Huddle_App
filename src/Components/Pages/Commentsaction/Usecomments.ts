import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

import type { Comment } from "../../../Schemas/singlepost.type";



const BASE_URL = "https://route-posts.routemisr.com";

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string | Record<string, unknown>;
};

type CommentsResponse = {
  comments?: Comment[];
};

function getHeaders() {
  const token = localStorage.getItem("user Token");

  if (!token) {
    throw new Error("Please log in to continue.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

function extractComments(
  response: ApiResponse<CommentsResponse | Comment[]>
): Comment[] {
  const result = response.data;

  if (Array.isArray(result)) {
    return result;
  }

  if (result && "comments" in result && Array.isArray(result.comments)) {
    return result.comments;
  }

  return [];
}

function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiResponse<unknown>>(error)) {
    const message = error.response?.data?.message;

    if (message) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

// GET COMMENTS
export function useComments(postId: string) {
  return useQuery<Comment[], Error>({
    queryKey: ["comments", postId],
    queryFn: async () => {
      const res = await axios.get<
        ApiResponse<CommentsResponse | Comment[]>
      >(
        `${BASE_URL}/posts/${postId}/comments?page=1&limit=10`,
        { headers: getHeaders() }
      );

      return extractComments(res.data);
    },
    enabled: Boolean(postId),
  });
}

// CREATE COMMENT
export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (content) => {
      const res = await axios.post(
        `${BASE_URL}/posts/${postId}/comments`,
        { content },
        { headers: getHeaders() }
      );

      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["getPostDetails", postId],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Create comment failed:", getErrorMessage(error));
    },
  });
}

// GET COMMENT REPLIES
export function useCommentReplies(
  postId: string,
  commentId: string
) {
  return useQuery<Comment[], Error>({
    queryKey: ["commentReplies", postId, commentId],
    queryFn: async () => {
      const res = await axios.get<
        ApiResponse<CommentsResponse | Comment[]>
      >(
        `${BASE_URL}/posts/${postId}/comments/${commentId}/replies?page=1&limit=10`,
        { headers: getHeaders() }
      );

      return extractComments(res.data);
    },
    enabled: Boolean(postId && commentId),
  });
}

// CREATE REPLY
export function useCreateReply(
  postId: string,
  commentId: string
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (content) => {
      const res = await axios.post(
        `${BASE_URL}/posts/${postId}/comments/${commentId}/replies`,
        { content },
        { headers: getHeaders() }
      );

      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["commentReplies", postId, commentId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Create reply failed:", getErrorMessage(error));
    },
  });
}

// UPDATE COMMENT
export function useUpdateComment(
  postId: string,
  commentId: string
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, string>({
    mutationFn: async (content) => {
      const res = await axios.put(
        `${BASE_URL}/posts/${postId}/comments/${commentId}`,
        { content },
        { headers: getHeaders() }
      );

      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["commentReplies", postId, commentId],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Update comment failed:", getErrorMessage(error));
    },
  });
}

// DELETE COMMENT
export function useDeleteComment(
  postId: string,
  commentId: string
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const res = await axios.delete(
        `${BASE_URL}/posts/${postId}/comments/${commentId}`,
        { headers: getHeaders() }
      );

      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["getPostDetails", postId],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Delete comment failed:", getErrorMessage(error));
    },
  });
}

// LIKE / UNLIKE COMMENT
export function useToggleCommentLike(
  postId: string,
  commentId: string
) {
  const queryClient = useQueryClient();

  return useMutation<unknown, Error, void>({
    mutationFn: async () => {
      const res = await axios.put(
        `${BASE_URL}/posts/${postId}/comments/${commentId}/like`,
        {},
        { headers: getHeaders() }
      );

      return res.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["comments", postId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["commentReplies", postId, commentId],
        }),
      ]);
    },
    onError: (error) => {
      console.error("Toggle comment like failed:", getErrorMessage(error));
    },
  });
}

