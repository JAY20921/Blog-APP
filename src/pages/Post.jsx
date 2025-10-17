import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams(); // slug = document ID
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post?.userid === userData?.$id;

  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((res) => {
        if (res) setPost(res);
        else navigate("/");
      });
    } else navigate("/");
  }, [slug, navigate]);

  // ✅ Delete post with confirmation
  const deletePost = async () => {
    if (!post?.$id) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return; // ❌ stop if cancelled

    const deleted = await appwriteService.deletePost(post.$id);
    if (deleted) {
      if (post.image) {
        await appwriteService.deleteFile(post.image);
      }
      navigate("/");
    }
  };

  if (!post) return <div className="py-8 text-center">Loading...</div>;

  return (
    <div className="py-8">
      <Container>
        {/* Image Section */}
        <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2 bg-gray-50">
          {post.image ? (
            <img
              src={appwriteService.getFileUrl(post.image)}
              alt={post.title}
              className="rounded-xl max-h-[500px] object-contain"
            />
          ) : (
            <div className="text-gray-500 italic py-24">
              No image attached to this post
            </div>
          )}

          {isAuthor && (
            <div className="absolute right-6 top-6 flex space-x-2">
              <Link to={`/edit-post/${post.$id}`}>
                <Button bgColor="bg-green-500">Edit</Button>
              </Link>
              <Button bgColor="bg-red-500" onClick={deletePost}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="w-full mb-6 text-center">
          <h1 className="text-3xl font-bold">{post.title}</h1>
        </div>

        {/* Content */}
        <div className="browser-css px-4">{parse(post.content || "")}</div>
      </Container>
    </div>
  );
}
