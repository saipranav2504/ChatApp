import React, { useState } from "react";
import Modal from "react-modal";
import { ChatState } from "../../Context/ChatProvider";
import { X, User, Search, Check } from "lucide-react";
import axios from "axios";

if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

const UpdateGroup = ({
  isOpen,
  onClose,
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const handleRemove = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      userToRemove._id !== user._id
    ) {
      alert("Only admins can remove the members !");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: userToRemove._id,
        },
        config
      );

      userToRemove._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      alert("Error in removing user from group ! ");
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      alert("User already in group ! ");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      alert("Only admins can add the members !");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert("Error in adding group members !");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      alert("Error in changing group name");
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${query}`, config);
      setSearchResult(data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Failed to search users");
    }
  };

  const handleLeaveGroup = () => {
    handleRemove(user);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-lg w-full p-6 mx-auto mt-20 bg-white rounded-xl shadow-xl relative"
      overlayClassName="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <h1 className="text-xl font-bold mb-4 text-center">
        {selectedChat.chatName}
      </h1>

      <h2 className="text-l font-bold mb-2 ">Group Members</h2>
      <div className="flex flex-wrap gap-2 p-2 bg-[rgb(13,17,60)]/5 rounded-lg">
        {selectedChat.users.map((u, index) => (
          <span
            key={u._id}
            onClick={() => handleRemove(u)}
            className="group bg-[rgb(13,17,60)] text-white px-3 py-1.5 rounded-full text-sm cursor-pointer
              hover:bg-red-500 transition-all duration-200 ease-out hover:scale-105 active:scale-95
              flex items-center gap-2 animate-in slide-in-from-left-2 fade-in-0"
          >
            <User className="w-3 h-3" />
            <span className="truncate max-w-24">{u.name}</span>
            <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <div className="relative w-full">
          <input
            type="text"
            value={groupChatName}
            onChange={(e) => setGroupChatName(e.target.value)}
            placeholder="Enter new group name"
            className="w-full text-black px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl bg-white/80
              shadow-sm focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/20
              transition-all duration-200 ease-out hover:bg-white"
          />
        </div>

        <button
          onClick={handleRename}
          className="px-5 py-3 bg-blue-900 text-white rounded-xl font-medium shadow-md
            hover:bg-blue-800 transition-all duration-200 ease-out hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-blue-900/40"
        >
          Update
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Add Users"
        className="w-full mt-2 text-black px-4 py-3 pr-12 border-2 border-gray-300 rounded-xl bg-white/80
          shadow-sm focus:outline-none focus:border-blue-900 focus:ring-4 focus:ring-blue-900/20
          transition-all duration-200 ease-out hover:bg-white"
      />

      {/* Searched Users */}
      <div className="space-y-2 mt-2">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="w-5 h-5 border-2 border-[rgb(13,17,60)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : search && searchResult.length > 0 ? (
          <div className="space-y-2">
            {searchResult.map((u, index) => (
              <div
                key={u._id}
                onClick={() => handleAddUser(u)}
                className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200
                  bg-gray-50 hover:bg-[rgb(13,17,60)]/5 border-2 border-transparent hover:border-[rgb(13,17,60)]/20
                  hover:scale-[1.02] active:scale-[0.98] animate-in slide-in-from-right-2 fade-in-0"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="p-2 bg-[rgb(13,17,60)]/10 rounded-full">
                  <User className="w-4 h-4 text-[rgb(13,17,60)]" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{u.name}</p>
                  <p className="text-sm text-gray-500">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        ) : search && searchResult.length === 0 && !loading ? (
          <div className="text-center py-6 text-gray-500 animate-in fade-in-0 slide-in-from-bottom-2">
            <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p>No users found</p>
          </div>
        ) : null}
      </div>

      <div className="w-full flex justify-end">
        <button
          onClick={handleLeaveGroup}
          className="px-5 py-3 mt-2 bg-red-900 text-white rounded-xl font-medium shadow-md 
            hover:bg-red-800 transition-all duration-200 ease-out hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-red-900/40"
        >
          Leave Group
        </button>
      </div>
    </Modal>
  );
};

export default UpdateGroup;
