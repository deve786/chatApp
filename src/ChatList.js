import { CheckBadgeIcon, CheckIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon, MinusCircleIcon, PencilSquareIcon, PlusCircleIcon, VideoCameraIcon } from '@heroicons/react/16/solid';
import React, { useEffect, useState } from 'react';
import AddChat from './AddChat';
import { useUserStore } from './lib/userStore';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { useChatStore } from './lib/chatStore';

function ChatList() {
  const [addUser, setAddUser] = useState(false);
  const [input, setInput] = useState("");
  const [chats, setChats] = useState([]);
  const { currentuser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId);
    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, 'userchats', currentuser.id);

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat.chatId, chat.user);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentuser.id), async (res) => {
      const items = res.data().chats;

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId);
        const userDocSnap = await getDoc(userDocRef);
        const user = userDocSnap.data();

        return { ...item, user };
      });
      const chatData = await Promise.all(promises);
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
    });

    return () => {
      unSub();
    };
  }, [currentuser.id]);

  const filteredChat = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()));

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


  return (
    <div className='md:flex-1 flex-none   '>
      <div className='chat-left gap-3 flex flex-col'>
        <div className='flex justify-between'>
          <div className='user items-center flex gap-2 font-bold px-3'>
            <img src={currentuser.avatar || "./avatar.jpg"} alt="" className='md:w-9 rounded-full md:h-9 w-6 h-6 object-cover' />
            <p className='md:text-sm text-xs'>{currentuser.username}</p>
          </div>
          <div className='icons flex gap-1 p-3 md:gap-3'>
            <EllipsisHorizontalIcon className='md:w-6 cursor-pointer w-4' />
            <VideoCameraIcon className='md:w-6 cursor-pointer w-4' />
            <PencilSquareIcon className='md:w-6 cursor-pointer w-4' />
          </div>
        </div>
        <div className='search flex justify-between p-3'>
          <div className='transparent bg-slate-500 w-[90%] items-center flex ps-2 rounded-lg'>
            <MagnifyingGlassIcon className='w-6' />
            <input type="text" className='bg-transparent border-none outline-none w-[100%] px-2 py-1' placeholder='search...' onChange={(e) => setInput(e.target.value)} />
          </div>
          {addUser ? (
            <MinusCircleIcon className='w-6 cursor-pointer' onClick={() => setAddUser(false)} />
          ) : (
            <PlusCircleIcon className='w-6 cursor-pointer' onClick={() => setAddUser(true)} />
          )}
        </div>
        <div className='mt-7 overflow-y-auto max-h-80'>
          {filteredChat.map(chat => (
            <div key={chat.chatId} onClick={() => handleSelect(chat)} className='user cursor-pointer pt-3 items-center flex gap-2 mb-2 pb-3 justify-between border-gray-500 border-b hover:bg-gray-700 px-3'>
              <div className='flex gap-2'>
                <img src={chat.user?.blocked?.includes(currentuser.id) ? "./avatar.jpg" : chat.user?.avatar || "./avatar.jpg"} alt="" className='w-9 rounded-full h-9' />
                <div className='flex flex-col leading-5'>
                  <p className='font-bold'>{chat.user?.blocked?.includes(currentuser.id) ? "User" : chat.user?.username}</p>
                  <div className='flex items-center'>
                    <p className='text-xs'>{chat.lastMessage ? chat.lastMessage.slice(0, 25) + '...' : ""}</p>

                  </div>
                </div>
              </div>
              <div className='flex flex-col items-end gap-2  ' >
                
                <p className='w-5 h-5 rounded-full bg-green-500 justify-center flex  ' style={{ display: chat.isSeen ? "none" : "flex" }}>*</p>
                <p className='text-xs text-white-500' style={{ color: chat.isSeen ? "text-white-500" : "text-green-500" }}>{formatTime(chat.updatedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='chat-center'></div>
      <div className='chat-right'></div>
      {addUser && <AddChat data={setAddUser} />}
    </div>
  );
}

export default ChatList;
