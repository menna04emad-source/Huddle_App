
import { useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCreatePost } from "../Createpost/useCreatePost";

export default function CreatePost() {
  const createPost = useCreatePost();
  const queryClient = useQueryClient();
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = e.currentTarget;
    const form = input.form;
    const preview =
      form?.querySelector<HTMLImageElement>("#post-preview");
    const removeButton =
      form?.querySelector<HTMLButtonElement>("#remove-photo");
    const file = input.files?.[0];

    if (!preview || !removeButton) return;

    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5 MB.");
        input.value = "";
        preview.classList.add("hidden");
        removeButton.classList.add("hidden");
        return;
      }

      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image.");
        input.value = "";
        preview.classList.add("hidden");
        removeButton.classList.add("hidden");
        return;
      }

      if (preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }

      preview.src = URL.createObjectURL(file);
      preview.classList.remove("hidden");
      removeButton.classList.remove("hidden");
    } else {
      if (preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }

      preview.src = "";
      preview.classList.add("hidden");
      removeButton.classList.add("hidden");
    }
  };

  const handleRemoveImage = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const form = e.currentTarget.form;
    const input =
      form?.querySelector<HTMLInputElement>('input[name="image"]');
    const preview =
      form?.querySelector<HTMLImageElement>("#post-preview");
    const removeButton =
      form?.querySelector<HTMLButtonElement>("#remove-photo");

    if (input) input.value = "";

    if (preview) {
      if (preview.src.startsWith("blob:")) {
        URL.revokeObjectURL(preview.src);
      }

      preview.src = "";
      preview.classList.add("hidden");
    }

    removeButton?.classList.add("hidden");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = formData.get("body")?.toString().trim() ?? "";
    const selectedImage = formData.get("image");

    const image =
      selectedImage instanceof File && selectedImage.size > 0
        ? selectedImage
        : null;

    if (!body && !image) {
      toast.warning("Please write something or select a photo.");
      return;
    }

    createPost.mutate(
      { body, image },
      {
        onSuccess: async () => {
          form.reset();

          const preview =
            form.querySelector<HTMLImageElement>("#post-preview");
          const removeButton =
            form.querySelector<HTMLButtonElement>("#remove-photo");

          if (preview) {
            if (preview.src.startsWith("blob:")) {
              URL.revokeObjectURL(preview.src);
            }

            preview.src = "";
            preview.classList.add("hidden");
          }

          removeButton?.classList.add("hidden");

          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: ["getAllposts"],
            }),
            queryClient.invalidateQueries({
              queryKey: ["profile"],
            }),
          ]);
        },
      }
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mb-6 w-full max-w-lg rounded-2xl bg-white p-5 shadow-md dark:bg-gray-800"
    >
      <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-white">
        Create a post
      </h2>

      <textarea
        name="body"
        placeholder="What's on your mind?"
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-200 p-3 outline-none focus:border-emerald-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
      />

      <div className="relative mt-3">
        <img
          id="post-preview"
          alt="Selected photo preview"
          className="hidden max-h-72 w-full rounded-xl object-contain"
        />

        <button
          id="remove-photo"
          type="button"
          onClick={handleRemoveImage}
          className="absolute right-2 top-2 hidden rounded-full bg-black/70 px-3 py-1 text-white hover:bg-red-600"
          aria-label="Remove photo"
        >
          ✕
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <label className="cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-white">
          📷 Add photo

          <input
            ref={imageInputRef}
            type="file"
            name="image"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <button
          type="submit"
          disabled={createPost.isPending}
          className="rounded-lg bg-emerald-500 px-6 py-2 font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {createPost.isPending ? "Publishing..." : "Publish"}
        </button>
      </div>
    </form>
  );
}
