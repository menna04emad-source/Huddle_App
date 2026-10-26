
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API = "https://route-posts.routemisr.com/posts";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("user Token")}`,
});

type EditPostData = {
  postId: string;
  body: string;
  image: File | null;
};

export function useEditPost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, body, image }: EditPostData) => {
      const formData = new FormData();
      formData.append("body", body);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.put(
        `${API}/${postId}`,
        formData,
        { headers: getHeaders() }
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["getAllposts"] });
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to update post"
        : "Something went wrong";

      toast.error(message);
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await axios.delete(
        `${API}/${postId}`,
        { headers: getHeaders() }
      );

      return data;
    },

    onSuccess: () => {
      toast.success("Post deleted successfully! 🗑️");

      queryClient.invalidateQueries({
        queryKey: ["getAllposts"],
      });
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to delete post"
        : "Something went wrong";

      toast.error(message);
    },
  });
}
