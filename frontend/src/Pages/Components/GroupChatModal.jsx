import React, { useState } from "react";
import Modal from "react-modal";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import { X, Search, User, Users, Plus, Check } from "lucide-react";


if (typeof window !== "undefined") {
  Modal.setAppElement("#root");
}

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const { user, chats, setChats } = ChatState();

  const openModal = () => {
    // Clear fields every time modal is opened
    setGroupName("");
    setSelectedUsers([]);
    setSearch("");
    setSearchResults([]);
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200);
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      setSearchResults([]);
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
      // Limit to top 3 results only
      setSearchResults(data.slice(0, 3));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert("Failed to search users");
    }
  };

  const handleAddUser = (userToAdd) => {
    if (selectedUsers.find((u) => u._id === userToAdd._id)) return;
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleRemoveUser = (userToRemove) => {
    setSelectedUsers(selectedUsers.filter((u) => u._id !== userToRemove._id));
  };

  const handleCreateGroup = async () => {
    if (!groupName || selectedUsers.length === 0) {
      alert("Please provide group name and add users");
      return;
    }

    try {
      setCreateLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setCreateLoading(false);
      closeModal();
    } catch (error) {
      setCreateLoading(false);
      alert("Failed to create group");
    }
  };

  return (
    <>
      <span onClick={openModal}>{children}</span>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Create Group Chat"
        className={`max-w-lg w-full p-0 mx-auto mt-8 bg-white rounded-2xl shadow-2xl relative overflow-hidden
          transform transition-all duration-300 ease-out
          ${isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"}
        `}
        overlayClassName={`fixed inset-0 z-50 flex items-center justify-center px-4
          transition-all duration-300 ease-out
          ${isClosing ? "bg-black/0" : "bg-black/40 backdrop-blur-sm"}
        `}
        closeTimeoutMS={200}
      >
        {/* Animated header with gradient */}
        <div className="bg-gradient-to-r from-[rgb(13,17,60)] to-[rgb(20,25,80)] px-6 py-4 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[rgb(13,17,60)]/90 to-[rgb(20,25,80)]/90"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Create Group Chat
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-lg
                transition-all duration-200 ease-out hover:scale-110 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Group name input with floating label effect */}
          <div className="relative group">
            <input
              type="text"
              placeholder=" "
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 ease-out
                focus:outline-none focus:border-[rgb(13,17,60)] focus:ring-4 focus:ring-[rgb(13,17,60)]/20
                peer placeholder-transparent bg-gray-50/50 hover:bg-white"
            />
            <label
              className="absolute left-4 -top-2.5 bg-white px-2 text-sm font-medium text-gray-600
              transition-all duration-200 ease-out peer-placeholder-shown:text-base 
              peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3 
              peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-sm 
              peer-focus:text-[rgb(13,17,60)] peer-focus:bg-white"
            >
              Group Name
            </label>
          </div>

          {/* Search input with icon */}
          <div className="relative group">
            <div
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400
              group-focus-within:text-[rgb(13,17,60)] transition-colors duration-200"
            >
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search users to add..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-200 ease-out
                focus:outline-none focus:border-[rgb(13,17,60)] focus:ring-4 focus:ring-[rgb(13,17,60)]/20
                bg-gray-50/50 hover:bg-white"
            />
          </div>

          {/* Selected users with animated tags */}
          {selectedUsers.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Check className="w-4 h-4 text-green-500" />
                Selected Users ({selectedUsers.length})
              </p>
              <div className="flex flex-wrap gap-2 p-2 bg-[rgb(13,17,60)]/5 rounded-lg">
                {selectedUsers.map((u, index) => (
                  <span
                    key={u._id}
                    onClick={() => handleRemoveUser(u)}
                    className="group bg-[rgb(13,17,60)] text-white px-3 py-1.5 rounded-full text-sm cursor-pointer
                      hover:bg-red-500 transition-all duration-200 ease-out hover:scale-105 active:scale-95
                      flex items-center gap-2 animate-in slide-in-from-left-2 fade-in-0"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <User className="w-3 h-3" />
                    <span className="truncate max-w-24">{u.name}</span>
                    <X className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                  </span>
                ))}
              </div>
            </div>
          )}

          
          <div className="space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="w-5 h-5 border-2 border-[rgb(13,17,60)] border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Searching users...</span>
                </div>
              </div>
            ) : search && searchResults.length > 0 ? (
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Search className="w-4 h-4 text-[rgb(13,17,60)]" />
                  Search Results 
                </p>
                <div className="space-y-1">
                  {searchResults.map((u, index) => {
                    const isSelected = selectedUsers.find(
                      (selected) => selected._id === u._id
                    );
                    return (
                      <div
                        key={u._id}
                        onClick={() => !isSelected && handleAddUser(u)}
                        className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ease-out
                          animate-in slide-in-from-right-2 fade-in-0 hover:scale-[1.02] active:scale-[0.98]
                          ${
                            isSelected
                              ? "bg-green-100 border-2 border-green-300 cursor-not-allowed opacity-60"
                              : "bg-gray-50 hover:bg-[rgb(13,17,60)]/5 border-2 border-transparent hover:border-[rgb(13,17,60)]/20"
                          }
                        `}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full transition-all duration-200
                            ${
                              isSelected
                                ? "bg-green-200"
                                : "bg-[rgb(13,17,60)]/10"
                            }
                          `}
                          >
                            <User
                              className={`w-4 h-4 
                              ${
                                isSelected
                                  ? "text-green-600"
                                  : "text-[rgb(13,17,60)]"
                              }
                            `}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {u.name}
                            </p>
                            <p className="text-sm text-gray-500">{u.email}</p>
                          </div>
                          {isSelected && (
                            <div className="p-1 bg-green-500 rounded-full animate-in zoom-in-50">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : search && searchResults.length === 0 && !loading ? (
              <div className="text-center py-6 text-gray-500 animate-in fade-in-0 slide-in-from-bottom-2">
                <Search className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p>No users found</p>
              </div>
            ) : null}
          </div>

          {/* Create button with loading state */}
          <button
            onClick={handleCreateGroup}
            disabled={createLoading || !groupName || selectedUsers.length === 0}
            className="w-full bg-gradient-to-r from-[rgb(13,17,60)] to-[rgb(20,25,80)] hover:from-[rgb(10,14,50)] hover:to-[rgb(15,20,70)]
              disabled:from-[rgb(13,17,60)]/60 disabled:to-[rgb(20,25,80)]/60 disabled:cursor-not-allowed
              text-white py-3 rounded-xl font-medium transition-all duration-200 ease-out
              hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg disabled:hover:scale-100
              flex items-center justify-center gap-2 relative overflow-hidden group"
          >
            {createLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Group...</span>
              </>
            ) : (
              <>
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                <span>Create Group Chat</span>
              </>
            )}
            <div className="absolute inset-0 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></div>
          </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[rgb(13,17,60)]/10 to-transparent rounded-full translate-y-12 -translate-x-12"></div>
      </Modal>
    </>
  );
};

export default GroupChatModal;
