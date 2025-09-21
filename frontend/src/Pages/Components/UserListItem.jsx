import React from "react";

const UserListItem = ({ user, handleFunction, index = 0 }) => {
  return (
    <div
      onClick={handleFunction}
      className="flex items-center space-x-3 p-4 rounded-xl bg-[rgb(13,17,60)]/20 hover:bg-blue-700/30 transition-all duration-300 cursor-pointer group border border-blue-700/20 hover:border-blue-600/40"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: "slideInUp 0.5s ease-out forwards",
      }}
    >
      {/* Profile Picture */}
      <img
        src={user.pic}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
      />

      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{user.name}</p>
        <p className="text-sm text-blue-300 truncate">{user.email}</p>
      </div>
    </div>
  );
};

export default UserListItem;
