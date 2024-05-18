import { EllipsisHorizontalIcon, MagnifyingGlassIcon, MinusCircleIcon, PencilSquareIcon, PlusCircleIcon, VideoCameraIcon } from '@heroicons/react/16/solid'
import React, { useEffect, useState } from 'react'
import AddChat from './AddChat'
import { useUserStore } from './lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from './lib/firebase'
import { useChatStore } from './lib/chatStore'

function ChatList() {
  const [addUser, setAddUser] = useState(false)
  const [input, setInput] = useState("")
  const [chats, setChats] = useState([])
  const { currentuser } = useUserStore()
  const { chatId, changeChat } = useChatStore()

  const handleSelect = async (chat) => {
    const userChats = chats.map(item => {
      const { user, ...rest } = item
      return rest
    })

    const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

    userChats[chatIndex].isSeen = true

    const userChatRef = doc(db, 'userchats', currentuser.id)

    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      })
      changeChat(chat.chatId, chat.user)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const unSub = onSnapshot(doc(db, 'userchats', currentuser.id), async (res) => {
      const items = res.data().chats

      const promises = items.map(async (item) => {
        const userDocRef = doc(db, 'users', item.receiverId)
        const userDocSnap = await getDoc(userDocRef)
        const user = userDocSnap.data()

        return { ...item, user };
      })
      const chatData = await Promise.all(promises)
      setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
    })

    return () => {
      unSub()
    }
  }, [currentuser.id])

  const filteredChat = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()))
  console.log(chats);

  return (
    <div className='flex-1 p-5'>
      <div className='chat-left gap-3 flex flex-col'>
        <div className='flex justify-between'>
          <div className='user items-center flex gap-2 font-bold px-3'>
            <img src={currentuser.avatar || "./avatar.jpg"} alt="" className='w-9 rounded-full h-9' />
            <p>{currentuser.username}</p>
          </div>
          <div className='icons flex gap-3'>
            <EllipsisHorizontalIcon className='w-6 cursor-pointer' />
            <VideoCameraIcon className='w-6 cursor-pointer' />
            <PencilSquareIcon className='w-6 cursor-pointer' />
          </div>
        </div>
        <div className='search flex justify-between'>
          <div className='transparent bg-slate-500 w-[90%] items-center flex ps-2 rounded-lg'>
            <MagnifyingGlassIcon className='w-6' />
            <input type="text" className='bg-transparent border-none outline-none w-[100%] px-2 py-1' placeholder='search...' onChange={(e) => setInput(e.target.value)} />
          </div>
          {addUser ? (
            <PlusCircleIcon className='w-6 cursor-pointer' onClick={() => setAddUser(false)} />
          ) : (
            <MinusCircleIcon className='w-6 cursor-pointer' onClick={() => setAddUser(true)} />
          )}
        </div>
        <div className='mt-7 overflow-y-auto max-h-80'>
          {filteredChat.map(chat => (
            <div key={chat.chatId} onClick={() => handleSelect(chat)} style={{ backgroundColor: chat?.isSeen ? "transparent" : "#5183fe" }} className='user items-center flex gap-2 mb-2 pb-3 items-center border-b hover:bg-gray-700 px-3'>
              <img src={chat.user.blocked.includes(currentuser.id) ? "./avatar.jpg" : chat.user.avatar || "./avatar.jpg"} alt="" className='w-9 rounded-full h-9' />
              <div className='flex flex-col leading-5'>
                <p className='font-bold'>{chat.user.blocked.includes(currentuser.id) ? "User" : chat.user.username}</p>
                <p>{chat.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='chat-center'></div>
      <div className='chat-right'></div>
      {addUser && <AddChat />}
    </div>
  )
}

export default ChatList