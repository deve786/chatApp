import { ArrowDownTrayIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid'
import React from 'react'
import { useUserStore } from './lib/userStore'
import { auth, db } from './lib/firebase'
import { useChatStore } from './lib/chatStore'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { Bounce, toast } from 'react-toastify'

function ChatDetails() {
  const { chatId, user, isRecieverBlocked, isCurrentUserBlocked, changeBlock } = useChatStore()
  const { currentuser } = useUserStore()

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

  return (
    <div className='flex-1 p-5 justify-between flex flex-col hidden md:block'>
      <div className='flex flex-col'>
        <div className='flex justify-center flex-col items-center border-b pb-3'>
          <img src={user?.avatar || './avatar.jpg'} alt="" className='rounded-full w-16 h-16' />
          <p className='font-bold'>{user?.username}</p>
          <p>Finding right path....</p>
        </div>

        <div>
          <div className='flex justify-between px-2 py-3'>
            <p className='text-md'>Chat Settings</p>
            <ChevronUpIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-1'>
            <p className='text-md'>Chat Settings</p>
            <ChevronUpIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-3'>
            <p className='text-md'>Shared Photos</p>
            <ChevronDownIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-3'>
            <img src="./imag1.jpeg" alt="" className='w-10 rounded' />
            <ArrowDownTrayIcon className='w-6 cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-3'>
            <img src="./image2.jpeg" alt="" className='w-10 h-8 rounded' />
            <ArrowDownTrayIcon className='w-6  cursor-pointer' />
          </div>
          <div className='flex justify-between px-2 py-3'>
            <img src="./image3.jpeg" alt="" className='w-10 rounded' />
            <ArrowDownTrayIcon className='w-6 cursor-pointer' />
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-2'>
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