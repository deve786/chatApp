import { CameraIcon, FaceSmileIcon, InformationCircleIcon, MicrophoneIcon, PhoneIcon, PhotoIcon } from '@heroicons/react/16/solid'
import EmojiPicker from 'emoji-picker-react'
import React, { useEffect, useState } from 'react'
import { db } from './lib/firebase'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore'
import { useChatStore } from './lib/chatStore'
import { useUserStore } from './lib/userStore'
import Upload from './lib/Upload'

function Chat() {
    const [open, setOpen] = useState(false)
    const [text, setText] = useState("")
    const [chat, setChat] = useState()
    const [img, setImg] = useState({
        file: null,
        url: '',
    })
    const { chatId, user, isRecieverBlocked, isCurrentUserBlocked } = useChatStore()
    const { currentuser } = useUserStore()

    const emojiHandle = e => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }

    const handleImg = e => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handleSend = async () => {
        if (text === "") return
        let imgUrl = null

        try {
            if (img.file) {
                imgUrl = await Upload(img.file)
            }
            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentuser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            })

            const userIDs = [currentuser.id, user.id]

            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, 'userchats', id)
                const userChatsSnapshot = await getDoc(userChatRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()
                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].isSeen = id === currentuser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatRef, {
                        chats: userChatsData.chats,
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }

        setImg({
            file: null,
            url: "",
        })

        setText("")
    }

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub()
        }
    }, [chatId])

    return (
        <div className='flex flex-col flex-auto border-x-2 p-5 justify-between'>
            <div>
                <div className='chat-top flex justify-between border-b pb-3 mb-3'>
                    <div className='user items-center flex gap-2 px-3'>
                        <img src={user?.avatar || "./avatar.jpg"} alt="" className='w-9 h-9 rounded-full' />
                        <div className='leading-4'>
                            <p className='font-bold'>{user?.username}</p>
                            <p className='text-xs'>Finding right path....</p>
                        </div>
                    </div>
                    <div className='flex gap-3'>
                        <PhoneIcon className='w-6 cursor-pointer' />
                        <CameraIcon className='w-6 cursor-pointer ' />
                        <InformationCircleIcon className='w-6 cursor-pointer ' />
                    </div>
                </div>

                <div className='chat flex flex-col gap-3 py-5 h-80 overflow-y-auto'>
                    {chat?.messages?.map((message) => (
                        <div key={message.createdAt} className={`flex ${message.senderId === currentuser.id ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex flex-col gap-2 mt-2 ${message.senderId === currentuser.id ? 'items-end' : 'items-start'}`}>
                                <div className={`${message.senderId === currentuser.id ? 'bg-blue-400 text-white' : 'bg-gray-100 text-black'} w-52 px-2 py-1 rounded`}>
                                    <p>{message.text}</p>
                                </div>
                                {message.img && (
                                    <div className='message'>
                                        <img src={message.img} alt="" className='w-25' />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    {img.url && (
                        <div className='message flex gap-2 mt-2 justify-end'>
                            <div>
                                <img src={img.url} alt="" className='w-25' />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='flex items-center justify-between gap-1 mt-3'>
                <div className='flex gap-2'>
                    <label htmlFor="file">
                        <PhotoIcon className='w-6 cursor-pointer' />
                        <input type="file" id="file" onChange={handleImg} className='hidden' disabled={isCurrentUserBlocked || isRecieverBlocked} />
                    </label>
                    <CameraIcon className='w-6 cursor-pointer' />
                    <MicrophoneIcon className='w-6 cursor-pointer' />
                </div>
                <div className='w-full bg-cyan-800 rounded'>
                    <input type="text" className='bg-transparent outline-none border-none px-2 py-1 w-full' onChange={e => setText(e.target.value)} value={text} />
                </div>
                <div className='flex gap-2'>
                    <div className='relative'>
                        <FaceSmileIcon className='w-6 cursor-pointer' onClick={() => setOpen((prev) => !prev)} />
                        {open && (
                            <div className='absolute bottom-10 left-0'>
                                <EmojiPicker onEmojiClick={emojiHandle} />
                            </div>
                        )}
                    </div>
                    <button className='px-4 py-1 bg-sky-200 rounded text-black sndBtn' onClick={handleSend} disabled={isCurrentUserBlocked || isRecieverBlocked}>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Chat
