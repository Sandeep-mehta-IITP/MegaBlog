import React from "react";
import appwriteService from "../appwrite/configure";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  const isValidFileId = featuredImage && typeof featuredImage === "string";

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-200">
        {/* Image Container */}
        <div className="w-full flex justify-center mb-4">
          {/* Check if featuredImage is valid before calling getFilePreview */}
          {isValidFileId ? (
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title}
              className="rounded-xl w-full h-48 sm:h-64 object-cover"
            />
          ) : (
            <div className="w-full h-48 sm:h-64 bg-gray-300 flex items-center justify-center rounded-xl">
              {/* Fallback image or placeholder */}
              <span className="text-gray-600">No image available</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg sm:text-xl font-bold text-center">{title}</h2>
      </div>
    </Link>
  );
}

export default PostCard;
