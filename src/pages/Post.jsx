import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
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

  const deletePost = async () => {
    if (!post?.$id) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    const deleted = await appwriteService.deletePost(post.$id);
    if (deleted) {
      if (post.image) {
        await appwriteService.deleteFile(post.image);
      }
      navigate("/");
    }
  };

  if (!post) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <Container>
        <article className="bg-white max-w-3xl mx-auto shadow-lg rounded-2xl overflow-hidden border border-gray-200">
          {/* Featured Image */}
          <div className="relative w-full bg-gray-100">
            {post.image ? (
              <img
                src={appwriteService.getFileUrl(post.image)}
                alt={post.title}
                className="w-full object-cover max-h-[500px]"
              />
            ) : (
              <div className="text-center text-gray-400 italic py-28">
                No image attached to this post
              </div>
            )}
            {isAuthor && (
              <div className="absolute right-5 top-5 flex space-x-3">
                <Link to={`/edit-post/${post.$id}`}>
                  <Button bgColor="bg-green-500 hover:bg-green-600 shadow">
                    Edit
                  </Button>
                </Link>
                <Button
                  bgColor="bg-red-500 hover:bg-red-600 shadow"
                  onClick={deletePost}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="px-8 py-10">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 text-center mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Subtitle / Metadata */}
            <div className="flex flex-col md:flex-row justify-center items-center text-sm text-gray-500 mb-4 space-y-1 md:space-y-0 md:space-x-4">
              <span>By {post.authorName || "Author"}</span>
              <span>•</span>
              <span>{new Date(post.$createdAt).toLocaleDateString()}</span>
            </div>

            {/* Divider */}
            <div className="w-20 h-1 bg-indigo-500 mx-auto mb-10 rounded-full"></div>

            {/* 🎨 Enhanced Body Content */}
            <div
              className="prose prose-lg lg:prose-xl max-w-none mx-auto
              prose-headings:font-semibold prose-headings:text-gray-900
              prose-p:text-gray-700 prose-p:leading-relaxed
              prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
              prose-a:text-indigo-600 hover:prose-a:text-indigo-700
              prose-blockquote:border-l-4 prose-blockquote:border-indigo-500 prose-blockquote:bg-gray-50 prose-blockquote:p-4 prose-blockquote:rounded-lg
              prose-ul:list-disc prose-li:marker:text-indigo-500
              space-y-6"
            >
              {parse(post.content || "")}
            </div>

            {/* Optional: Social share */}
            <div className="mt-12 flex justify-center space-x-4">
              <Button
                bgColor="bg-indigo-600 hover:bg-indigo-700 shadow"
                onClick={() =>
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                Share on Facebook
              </Button>
              <Button
                bgColor="bg-blue-500 hover:bg-blue-600 shadow"
                onClick={() =>
                  window.open(
                    `https://x.com/intent/x?url=${window.location.href}`,
                    "_blank"
                  )
                }
              >
                X
              </Button>
            </div>
          </div>
        </article>
      </Container>
    </div>
  );
}
