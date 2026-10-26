
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const API = "https://route-posts.routemisr.com/posts";

type CreatePostData = {
  body: string;
  image: File | null;
};

type CreatedPost = {
  _id: string;
  body: string;
  image?: string;
  user?: {
    _id: string;
    name?: string;
    username?: string;
    photo?: string;
  };
  [key: string]: unknown;
};

type ProfileCache = {
  user: {
    _id: string;
    name: string;
    username: string;
    photo?: string | null;
  };
};

function extractCreatedPost(response: any): CreatedPost | null {
  const candidates = [
    response?.data?.post,
    response?.data?.posts?.[0],
    response?.data?.data?.post,
    response?.data?.data,
    response?.data,
  ];

  return (
    candidates.find(
      (item) =>
        item &&
        typeof item._id === "string" &&
        typeof item.body === "string"
    ) ?? null
  );
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ body, image }: CreatePostData) => {
      const formData = new FormData();
      formData.append("body", body);

      if (image) {
        formData.append("image", image);
      }

      const { data } = await axios.post(API, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("user Token")}`,
        },
      });

      console.log("Created post response:", data);

      return data;
    },

    onSuccess: async (response) => {
      const createdPost = extractCreatedPost(response);

      if (createdPost) {
        // Keep the new post in the posts cache until the API refresh completes.
        queryClient.setQueryData<CreatedPost[]>(
          ["getAllposts"],
          (oldPosts) => {
            if (!oldPosts) return oldPosts;

            return [
              createdPost,
              ...oldPosts.filter(
                (post) => post._id !== createdPost._id
              ),
            ];
          }
        );

        // Also refresh the profile's displayed data if it is cached.
        queryClient.setQueryData<ProfileCache>(
          ["profile"],
          (oldProfile) => oldProfile
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ["getAllposts"],
      });

      toast.success("Post published successfully!");
    },

    onError: (error: unknown) => {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to create post."
        : "Something went wrong.";

      toast.error(message);
    },
  });
}
