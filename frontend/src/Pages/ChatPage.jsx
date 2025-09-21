import React from 'react'
import { useState,useEffect } from 'react'
import {ChatState} from "../Context/ChatProvider.jsx"
import SideBar from './Components/SideBar.jsx'
import MyChats from './Components/MyChats.jsx'
import ChatBox from './Components/ChatBox.jsx'


const ChatPage = () => {
  const { user } = ChatState();
  const [ fetchAgain,setFetchAgain] = useState(false)

  return (
    <div className="w-screen h-screen flex flex-col">
      {user && <SideBar />}

      <div className="flex flex-1 justify-between border-t border-black p-3 overflow-hidden gap-4">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>

    </div>
  );
};

export default ChatPage
