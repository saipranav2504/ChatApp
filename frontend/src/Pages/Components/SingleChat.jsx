import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/ChatProvider";
import Profile from "./Profile";
import UpdateGroup from "./UpdateGroup";
import ScrollableChat from "./ScrollableChat";
import axios from "axios";
import io from "socket.io-client";
import Lottie from "lottie-react";
import typingAnimation from "../../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat } = ChatState();

  const [viewProfileUser, setViewProfileUser] = useState(null);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      console.log("Fetched messages : ", data);

      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      alert("Failed to load messages !");
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        // give notification
      } else {
        setMessages((prev) => [...prev, newMessageReceived]);
      }
    });

    return () => {
      socket.off("message received");
    };
  }, []);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log(data);
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        alert("Error in sending the message ! ");
      }
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  let name = "";
  let pic = "";
  let fullUser = null;

  if (selectedChat) {
    if (selectedChat.isGroupChat) {
      name = selectedChat.chatName;
    } else {
      const otherUser = selectedChat.users.find((u) => u._id !== user._id);
      name = otherUser?.name || "";
      pic = otherUser?.pic || "";
      fullUser = otherUser || null;
    }
  }

  return (
    <>
      {selectedChat ? (
        <div className="flex-grow min-w-[60%] max-w-[100%] h-full border border-gray-900 rounded-xl flex flex-col ml-4 bg-gray-100 animate-slideIn">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50">
            {!selectedChat.isGroupChat && (
              <img
                src={pic}
                alt={name}
                onClick={() => setViewProfileUser(fullUser)}
                className="w-9 h-9 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform duration-300 border-2 border-white shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            )}
            <h2
              className={`text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors duration-200 ${
                selectedChat.isGroupChat ? "cursor-pointer hover:underline" : ""
              }`}
              onClick={() => {
                if (selectedChat.isGroupChat) setIsGroupModalOpen(true);
              }}
            >
              {name}
            </h2>
          </div>

          {/* Messages area */}
          <div className="flex-1 px-6 py-4 text-gray-500 italic overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ScrollableChat messages={messages} />
            )}
          </div>

          {/* Typing indicator positioned above input */}
          {isTyping && (
            <div className="px-6 pb-2 animate-fadeIn mt-2">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg max-w-10">
                <div className="w-16">
                  <Lottie animationData={typingAnimation} loop autoplay />
                </div>
                {/* <span className="text-xs text-gray-500">typing...</span> */}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="p-4 border-t flex items-center gap-2 bg-gray-50">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={newMessage}
              onChange={typingHandler}
              onKeyDown={sendMessage}
            />
            <button
              className="bg-[rgb(13,17,60)] text-white px-5 py-2 rounded-lg hover:opacity-90 hover:scale-105 transition-all duration-200 transform"
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-grow min-w-[60%] max-w-[100%] h-full flex items-center justify-center text-gray-500 ml-4 border border-gray-300 rounded-xl bg-white animate-fadeIn">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <svg
                className="w-8 h-8 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-lg">Click on a user to start chatting</p>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {viewProfileUser && (
        <Profile
          user={viewProfileUser}
          onClose={() => setViewProfileUser(null)}
          loggedInUser={user}
        />
      )}

      {/* Group Update Modal */}
      {isGroupModalOpen && (
        <UpdateGroup
          isOpen={isGroupModalOpen}
          onClose={() => setIsGroupModalOpen(false)}
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          fetchMessages={fetchMessages}
        />
      )}
    </>
  );
};

export default SingleChat;
