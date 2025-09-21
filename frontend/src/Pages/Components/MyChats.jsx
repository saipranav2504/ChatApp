import React, { useEffect, useState } from "react";
import axios from "axios";
import { MessageCircle, Plus, Users } from "lucide-react";
import { ChatState } from "../../Context/ChatProvider";
import GroupChatModal from "./GroupChatModal";

const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
      setIsLoading(false);
      setIsVisible(true);
    } catch (error) {
      console.error("Failed to load chats:", error);
      alert("Failed to load chats!");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const info = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(info);
    if (user) fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`w-full md:w-1/3 bg-white rounded-lg border shadow-lg overflow-hidden
      transform transition-all duration-700 ease-out
      ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}
    `}
    >
      {/* Header with animated entrance */}
      <div
        className={`flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50
        transform transition-all duration-500 delay-200 ease-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
      `}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">My Chats</h2>
        </div>

        <GroupChatModal>
          <button
            className="group bg-blue-600 text-white text-sm px-3 py-2 rounded-lg 
          hover:bg-blue-700 transition-all duration-200 ease-out
          hover:scale-105 hover:shadow-md active:scale-95
          transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <div className="flex items-center gap-1">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>New Group</span>
            </div>
          </button>
        </GroupChatModal>

      </div>

      {/* Chat list container */}
      <div className="flex flex-col max-h-[calc(100vh-150px)] overflow-y-auto">
        {isLoading ? (
          // Enhanced loading animation
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`animate-pulse transform transition-all duration-300`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="bg-gray-200 rounded-lg p-4 space-y-2">
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                  <div className="bg-gray-300 h-3 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {chats && chats.length > 0 ? (
              chats.map((chat, index) => (
                <div
                  key={chat._id}
                  onClick={() => setSelectedChat(chat)}
                  className={`cursor-pointer px-4 py-3 rounded-lg border
                    transform transition-all duration-150 ease-out
                    hover:scale-[1.02] hover:shadow-md active:scale-[0.98]
                    ${
                      selectedChat?._id === chat._id
                        ? "bg-blue-700 text-white shadow-lg border-blue-700"
                        : "bg-gray-50 hover:bg-blue-100 text-gray-800 border-gray-200 hover:border-blue-300"
                    }
                    ${
                      isVisible
                        ? "translate-x-0 opacity-100"
                        : "translate-x-8 opacity-0"
                    }
                  `}
                  style={{
                    transitionDelay: "100ms",
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-full transition-all duration-150
                      ${
                        selectedChat?._id === chat._id
                          ? "bg-white bg-opacity-20"
                          : "bg-blue-100 hover:bg-blue-200"
                      }`}
                    >
                      {chat.isGroupChat ? (
                        <Users
                          className={`w-4 h-4 transition-colors duration-150 
                          ${
                            selectedChat?._id === chat._id
                              ? "text-white"
                              : "text-blue-600"
                          }`}
                        />
                      ) : (
                        <MessageCircle
                          className={`w-4 h-4 transition-colors duration-150
                          ${
                            selectedChat?._id === chat._id
                              ? "text-white"
                              : "text-blue-600"
                          }`}
                        />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className={`font-medium truncate transition-colors duration-150
                        ${
                          selectedChat?._id === chat._id
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {chat.isGroupChat
                          ? chat.chatName
                          : getSender(loggedUser, chat.users)}
                      </p>
                      {chat.latestMessage && (
                        <p
                          className={`text-sm truncate mt-1 transition-colors duration-150
                          ${
                            selectedChat?._id === chat._id
                              ? "text-blue-100"
                              : "text-gray-600"
                          }`}
                        >
                          <span className="font-medium">
                            {chat.latestMessage.sender.name}:
                          </span>{" "}
                          <span className="opacity-90">
                            {chat.latestMessage.content}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`text-center py-12 transform transition-all duration-200 delay-200
                ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }
              `}
              >
                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4 animate-bounce" />
                <p className="text-gray-500 text-lg">No chats yet</p>
                <p className="text-gray-400 text-sm mt-1">
                  Start a conversation to see your chats here
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subtle bottom gradient for scroll indication */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
  );
};

export default MyChats;
