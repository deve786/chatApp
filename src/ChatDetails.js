import { ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'
import React, { useEffect, useState } from 'react'
import { useUserStore } from './lib/userStore'
import { auth, db } from './lib/firebase'
import { useChatStore } from './lib/chatStore'
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { Bounce, toast } from 'react-toastify'

function ChatDetails({ data }) {
  const [chatMedia, setChatMedia] = useState([]);
  const { chatId, user, isRecieverBlocked, isCurrentUserBlocked, changeBlock } = useChatStore()
  const { currentuser } = useUserStore()
  const [chatMedias,setChatMedias]=useState(false)
  const handleBlock = async () => {
    if (!user) return;

    const userDocRef = doc(db, "users", currentuser.id)

    try {
      await updateDoc(userDocRef, {
        blocked: isRecieverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      })

      changeBlock()
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    // Fetch chat media data
    const unsubscribe = onSnapshot(doc(db, 'chats', chatId), (snapshot) => {
      const chatData = snapshot.data();
      if (chatData && chatData.messages) {
        const media = chatData.messages.filter(message => message.img);
        setChatMedia(media);
      }
    });

    return () => unsubscribe();
  }, [chatId]);
  console.log(isCurrentUserBlocked);
  console.log(chatMedia);
  return (
    <div className='flex-1  justify-between border-s border-gray-500 flex flex-col ' style={{ display: data ? 'flex' : 'none' }}>
      <div className='flex flex-col'>
        <div className='flex justify-center flex-col items-center  border-gray-500 border-b p-5'>
          <img src={user?.avatar || './avatar.jpg'} alt="" className='rounded-full w-16 h-16' />
          <p className='font-bold'>{user?.username}</p>

        </div>

        <div className='p-5'>
          <div className='flex justify-between px-2 py-3'>
            <p className='text-md'>Chat Settings</p>
            <ChevronUpIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-1'>
            <p className='text-md'>Chat Settings</p>
            <ChevronUpIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-3' onClick={()=>{setChatMedias(prev=>!prev)}}>
            <p className='text-md'>Shared Photos</p>
           { 
           chatMedias?
           <ChevronUpIcon className='w-6 cursor-pointer'  />
           :
           <ChevronDownIcon className='w-6 cursor-pointer' />
           }
          </div>
          <div className='overflow-scroll h-52'>
            {chatMedia.map((media, index) => (
              <div key={index} className="flex justify-between px-2 py-3 " style={{display:chatMedias?'none':'flex'}} >
                <img src={media.img} alt="Media" className='w-10 h-10 rounded' />
                <a href={media.img} download target='_blank'>
                  <ArrowDownTrayIcon className='w-6 cursor-pointer' />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2 p-5'>
        <button onClick={handleBlock} className='px-4 py-1 bg-red-500 rounded'>
          {isCurrentUserBlocked ? "You are Blocked" : isRecieverBlocked ? "User Blocked" : "Block User"}
        </button>
        <button className='px-4 py-1 bg-blue-500 rounded' onClick={() => {
          auth.signOut()
          toast.success('Logout...', {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
        }}>Log Out</button>
      </div>
    </div>
  )
}

export default ChatDetails