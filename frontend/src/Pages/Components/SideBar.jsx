import React, { useState } from 'react';
import { Search, Menu, X, User, LogOut, MessageCircle } from 'lucide-react';
import { ChatState } from '../../Context/ChatProvider';
import Profile from './Profile';
import { useNavigate } from 'react-router-dom';
import ChatLoading from './ChatLoading';
import axios from 'axios';
import UserListItem from './UserListItem';

const SideBar = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      alert("Search field is empty");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      alert("Error! Failed to load search details");
    }
  };

  const accessChat = async (userId) => {

      try {
        setLoadingChat(true)
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post('/api/chat', { userId } , config);

        if(!chats.find((c)=>{c._id === data._id}))
            setChats([data,chats])

        setSelectedChat(data)
        setLoadingChat(false)
        onClose()

      } catch (error) {
        alert("Error in fetching chats")
      }

  }

  const toggleDrawer = () => setDrawerOpen(prev => !prev);

  const SkeletonLoader = () => (
    <div className="space-y-3 animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-[rgb(13,17,60)]/30">
          <div className="w-10 h-10 bg-[rgb(13,17,60)]/50 rounded-full animate-pulse"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[rgb(13,17,60)]/50 rounded animate-pulse"></div>
            <div className="h-3 bg-[rgb(13,17,60)]/30 rounded w-3/4 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 transition-opacity duration-300"
          onClick={toggleDrawer}
        />
      )}

      
      <div className="w-full h-20 bg-[rgb(13,17,60)] flex items-center px-6 justify-between shadow-2xl relative z-40 border-b border-blue-700/30">
        
        <div className="flex items-center gap-3 w-1/3">
          <button
            onClick={toggleDrawer}
            className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-500/30"
          >
            <MessageCircle
              size={18}
              className="group-hover:rotate-12 transition-transform duration-300"
            />
            <span className="font-medium">
              {drawerOpen ? "Close" : "Chats"}
            </span>
          </button>
        </div>

      
        <div className="w-1/3 text-center">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200 tracking-wider drop-shadow-lg">
            Chit-Chat
          </h1>
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto mt-1"></div>
        </div>

       
        <div className="w-1/3 flex justify-end relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600/80 backdrop-blur-sm text-white rounded-xl hover:bg-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-blue-500/30"
          >
            <Menu
              size={18}
              className={`transition-transform duration-300 ${
                menuOpen ? "rotate-90" : ""
              }`}
            />
            <span className="font-medium">Menu</span>
          </button>

          
          <div
            className={`
            absolute right-0 top-full mt-3 w-48 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-200/50 overflow-hidden z-50
            transform transition-all duration-300 origin-top-right
            ${
              menuOpen
                ? "scale-100 opacity-100 translate-y-0"
                : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
            }
          `}
          >
            <div className="p-2">
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-200 group"
                onClick={() => {
                  setMenuOpen(false);
                  setShowProfile(true);
                }}
              >
                <User
                  size={18}
                  className="text-blue-600 group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">Profile</span>
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                onClick={logoutHandler}
              >
                <LogOut
                  size={18}
                  className="group-hover:scale-110 transition-transform duration-200"
                />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div
        className={`
        fixed top-0 left-0 h-full w-80 bg-[rgb(13,17,60)] shadow-2xl transform text-white z-30
        ${drawerOpen ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-500 ease-out border-r border-blue-700/30
      `}
      >
       
        <div className="h-20 flex items-center justify-between px-6 bg-[rgb(13,17,60)]/50 backdrop-blur-sm border-b border-blue-700/30">
          <h2 className="text-xl font-bold text-blue-200">Navigation</h2>
          <button
            onClick={toggleDrawer}
            className="p-2 hover:bg-blue-700/50 rounded-lg transition-colors duration-200"
          >
            <X size={20} />
          </button>
        </div>

        
        <div className="p-6 h-full overflow-y-auto">
          
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-blue-300 mb-4 uppercase tracking-wider">
              Find Users
            </h3>
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-3 bg-[rgb(13,17,60)]/30 backdrop-blur-sm border border-blue-600/30 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <button
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Go"
                  )}
                </button>
              </div>
            </div>
          </div>

         
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">
              {loading
                ? "Searching..."
                : searchResult.length > 0
                ? "Search Results"
                : "Recent Chats"}
            </h3>

            {loading ? (
              <SkeletonLoader />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      
      {showProfile && (
        <Profile user={user} onClose={() => setShowProfile(false)} />
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default SideBar;