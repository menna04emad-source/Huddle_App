
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API = "https://route-posts.routemisr.com";

function getAuthHeaders() {
  const token = localStorage.getItem("user Token");

  return {
    Authorization: `Bearer ${token}`,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return fallback;
}

export function usePostActions(postId: string) {
  const queryClient = useQueryClient();

  const refreshPosts = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["getAllposts"] }),
      queryClient.invalidateQueries({ queryKey: ["profile"] }),
      queryClient.invalidateQueries({ queryKey: ["post", postId] }),
    ]);
  };

  const likeMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(
        `${API}/posts/${postId}/like`,
        {},
        { headers: getAuthHeaders() }
      );

      return data;
    },

    onSuccess: async () => {
      await refreshPosts();
      toast.success("Like updated successfully!");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Couldn't update like."));
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(
        `${API}/posts/${postId}/bookmark`,
        {},
        { headers: getAuthHeaders() }
      );

      return data;
    },

    onSuccess: async () => {
      await refreshPosts();
      await queryClient.invalidateQueries({
        queryKey: ["bookmarks"],
      });
      toast.success("Saved posts updated!");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Couldn't update saved post."));
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.post(
        `${API}/posts/${postId}/share`,
        {},
        { headers: getAuthHeaders() }
      );

      return data;
    },

    onSuccess: async () => {
      await refreshPosts();
      toast.success("Post shared successfully!");
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Couldn't share this post."));
    },
  });

  return {
    likePost: likeMutation.mutate,
    bookmarkPost: bookmarkMutation.mutate,
    sharePost: shareMutation.mutate,

    isLiking: likeMutation.isPending,
    isBookmarking: bookmarkMutation.isPending,
    isSharing: shareMutation.isPending,
  };
}
