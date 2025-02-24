import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/configure";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


export default function PostForm({ post }) {
  //console.log("post object:", post);
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    //console.log("post", post);
   
    
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        if (post) {
          
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null;
            //console.log("data", data);
            
            if (file) {
                appwriteService.deleteFile(post.featuredImage);
            }
            //console.log("post.$id", post.$id);
            //console.log("post.featuredImage", post.featuredImage);
            //console.log("file", file);
            
            const dbPost = await appwriteService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined,
            });

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            }
        } else {
            const file = await appwriteService.uploadFile(data.image[0]);

            if (file) {
                const fileId = file.$id;
                data.featuredImage = fileId;
                const dbPost = await appwriteService.createPost({ ...data, userId: userData.$id });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

  return (
    <form
  onSubmit={handleSubmit(submit)}
  className="flex flex-wrap"
>
  {/* Left Column (Title, Slug, Content) */}
  <div className="w-full px-2 lg:w-2/3">
    <Input
      label="Title: "
      placeholder="Title"
      className="mb-4"
      {...register("title", { required: true })}
    />

    <Input
      label="Slug: "
      placeholder="Slug"
      className="mb-4"
      {...register("slug", { required: true })}
      onInput={(e) => {
        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
      }}
    />

    <RTE
      label="Content: "
      name="content"
      control={control}
      defaultValue={getValues("content")}
    />
  </div>

  {/* Right Column (Featured Image) */}
  <div className="w-full px-2 lg:w-1/3">
    <Input
      label="Featured Image: "
      type="file"
      className="mb-4"
      placeholder="Featured Image"
      accept="image/png, image/jpg, image/jpeg, image/gif"
      {...register("image", { required: !post })}
    />
  </div>

  {/* Featured Image Preview (if post exists) */}
  {post && post.featuredImage && (
    <div className="w-full mb-4 px-2">
      <img
        src={appwriteService.getFilePreview(post.featuredImage)}
        alt={post.title}
        className="rounded-lg w-full"
      />
    </div>
  )}

  {/* Status Select */}
  <div className="w-full px-2">
    <Select
      options={["active", "inactive"]}
      label="Status"
      className="mb-4"
      {...register("status", { required: true })}
    />
  </div>

  {/* Submit Button */}
  <div className="w-full px-2">
    <Button
      type="submit"
      bgColor={post ? "bg-green-500" : undefined}
      className="w-full"
    >
      {post ? "Update" : "Submit"}
    </Button>
  </div>
</form>
  )
}
