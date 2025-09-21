import React from "react";
import { ChatState } from "../../Context/ChatProvider";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <div className="flex flex-col gap-2">
      {messages?.map((m) => {
        const isOwnMessage = m.sender._id === user._id;

        return (
          <div
            key={m._id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                isOwnMessage
                  ? "bg-blue-700 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {m.content}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ScrollableChat;
