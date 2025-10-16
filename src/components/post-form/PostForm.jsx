import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
  const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.$id || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const submit = async (data) => {
    try {
      let fileId = post?.image || null;

      if (data.image && data.image[0]) {
        const file = await appwriteService.uploadFile(data.image[0]);
        if (file) {
          if (post?.image) await appwriteService.deleteFile(post.image);
          fileId = file.$id;
        }
      }

      const dbPost = post
        ? await appwriteService.updatePost(post?.$id, {
            ...data,
            featuredImage: fileId,
          })
        : await appwriteService.createPost({
            ...data,
            userId: userData?.$id,
            featuredImage: fileId,
          });

      if (dbPost?.$id) navigate(`/post/${dbPost.$id}`);
    } catch (err) {
      console.error("PostForm submit error:", err);
    }
  };

  const slugTransform = useCallback((value) => {
    return value
      ? value.trim().toLowerCase().replace(/[^a-zA-Z\d\s]+/g, "-").replace(/\s/g, "-")
      : "";
  }, []);

  React.useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") setValue("slug", slugTransform(value.title));
    });
    return () => subscription.unsubscribe();
  }, [watch, slugTransform, setValue]);

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-4">
      <div className="flex-2 w-full md:w-2/3 space-y-4">
        <Input label="Title:" {...register("title", { required: true })} />
        <Input
          label="Slug:"
          {...register("slug", { required: true })}
          onInput={(e) => setValue("slug", slugTransform(e.currentTarget.value))}
        />
        <RTE
          label="Content:"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      <div className="flex-1 w-full md:w-1/3 space-y-4">
        <Input
          label="Featured Image:"
          type="file"
          accept="image/*"
          {...register("image", { required: !post })}
        />

        {post?.image && (
          <img
            src={appwriteService.getFileUrl(post.image)}
            alt={post?.title}
            className="w-full rounded-lg"
          />
        )}

        <Select
          options={["active", "inactive"]}
          label="Status:"
          {...register("status", { required: true })}
        />
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500"
        >
          {post ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
}
