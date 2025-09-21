import React from "react";
import { X } from "lucide-react";

const Profile = ({ user, onClose, loggedInUser }) => {
  if (!user) return null;

  const isSelf = loggedInUser && loggedInUser._id === user._id;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-gradient-to-b from-[rgb(13,17,60)] via-[rgb(13,17,60)]/98 to-[rgb(13,17,60)] p-8 rounded-2xl shadow-2xl border border-blue-500/20 text-white max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 hover:scale-110 group"
        >
          <X
            size={20}
            className="text-blue-300 group-hover:text-white transition-colors duration-200"
          />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 mb-4">
            User Profile
          </h2>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
        </div>

        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={user.pic}
              alt={user.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-blue-400/30 shadow-lg hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div
              className="w-24 h-24 bg-gradient-to-br from-blue-500/60 to-blue-600/60 rounded-full hidden items-center justify-center text-2xl font-bold mx-auto border-2 border-blue-400/30 shadow-lg"
              style={{ display: "none" }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-[rgb(13,17,60)] shadow-sm"></div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="p-4 bg-[rgb(13,17,60)]/40 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-400/30 transition-colors duration-300">
            <p className="text-sm text-blue-300 mb-1 font-medium">Full Name</p>
            <p className="text-white font-semibold text-lg">{user.name}</p>
          </div>

          <div className="p-4 bg-[rgb(13,17,60)]/40 backdrop-blur-sm rounded-xl border border-blue-500/20 hover:border-blue-400/30 transition-colors duration-300">
            <p className="text-sm text-blue-300 mb-1 font-medium">
              Email Address
            </p>
            <p className="text-white font-semibold">{user.email}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[rgb(13,17,60)]/80 to-[rgb(13,17,60)]/60 hover:from-blue-600/30 hover:to-blue-500/30 rounded-xl font-medium transition-all duration-300 border border-blue-500/20 hover:border-blue-400/40 hover:scale-105 hover:shadow-lg"
          >
            Close
          </button>

          {isSelf && (
            <button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600/60 to-blue-500/60 hover:from-blue-600/80 hover:to-blue-500/80 rounded-xl font-medium transition-all duration-300 border border-blue-400/30 hover:border-blue-300/50 hover:scale-105 hover:shadow-lg"
              onClick={() => {
                console.log("Edit profile clicked");
              }}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
