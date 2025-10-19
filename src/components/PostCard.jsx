import React, { useState, useEffect } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";

// --- SVG Icons ---
// I've included these simple SVGs so you don't need to install any new libraries.

// Icon for the top-right menu
const MoreVertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
);

// Icon for "Favorite"
const FavoriteIcon = ({ isLiked }) => (
    // The icon's fill color will change based on the isLiked state
    <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

// Icon for "Share"
const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" width="24" height="24">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 8.81C7.5 8.31 6.79 8 6 8c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.23-.09.46-.09.7 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
  </svg>
);

// --- New PostCard Component ---

function PostCard({ $id, title, image, likes }) { // Added 'likes' prop
    const avatarLetter = title ? title[0].toUpperCase() : 'B';

    // --- Like State Management ---
    const getInitialLikedState = () => {
        // Check localStorage to see if this post was already liked by the user
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
        return likedPosts.includes($id);
    };

    const [isLiked, setIsLiked] = useState(getInitialLikedState);
    const [likeCount, setLikeCount] = useState(likes || 0);

    const handleLikeClick = (e) => {
        // Prevent the click from bubbling up to the Link component
        e.preventDefault();
        e.stopPropagation();

        const newLikedState = !isLiked;
        setIsLiked(newLikedState); // Update UI instantly

        // Update the like count based on the new state
        setLikeCount(currentCount => newLikedState ? currentCount + 1 : currentCount - 1);

        // Update the backend and localStorage
        const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
        if (newLikedState) {
            localStorage.setItem("likedPosts", JSON.stringify([...likedPosts, $id]));
            appwriteService.likePost($id); // Call your Appwrite service
        } else {
            localStorage.setItem("likedPosts", JSON.stringify(likedPosts.filter(id => id !== $id)));
            appwriteService.unlikePost($id); // Call your Appwrite service
        }
    };

    return (
        // This outer div is the card itself, styled to look like the MUI card
        <div className="max-w-sm w-full bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
            
            {/* CardHeader */}
            <div className="flex items-center p-4">
                <div className="w-10 h-10 rounded-full bg-red-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-xl">
                    {avatarLetter}
                </div>
                <div className="ml-4 flex-grow">
                    <h2 className="font-semibold text-gray-900 leading-tight truncate">{title}</h2>
                    <p className="text-sm text-gray-500">View Post</p>
                </div>
                <button className="p-2 ml-2 flex-shrink-0 rounded-full text-gray-500 hover:bg-gray-100">
                    <MoreVertIcon />
                </button>
            </div>

            {/* CardMedia (Image) - This is the main link to the post */}
            <Link to={`/post/${$id}`}>
                <img
                    className="w-full h-48 object-cover"
                    src={appwriteService.getFileView(image)}
                    alt={title}
                />
            </Link>

            {/* CardContent (Snippet) */}
            <div className="p-4">
                <p className="text-gray-700 text-sm">
                    This impressive post is a perfect read. Click the image above to see the full article!
                </p>
            </div>

            {/* CardActions (with like functionality) */}
            <div className="flex items-center p-2 border-t border-gray-100">
                <button 
                    onClick={handleLikeClick} 
                    className={`flex items-center p-2 rounded-full transition-colors ${
                        isLiked ? 'text-red-500' : 'text-gray-500 hover:bg-gray-100 hover:text-red-500'
                    }`}
                >
                    <FavoriteIcon isLiked={isLiked} />
                    <span className="ml-2 text-sm font-semibold">{likeCount}</span>
                </button>
                <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-blue-500 transition-colors">
                    <ShareIcon />
                </button>
            </div>
        </div>
    );
}

export default PostCard;

