import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore'
import React, { useState } from 'react'
import { db } from './lib/firebase'
import { useUserStore } from './lib/userStore'

function AddChat({data}) {
  const [user, setUser] = useState(null)


  const { currentuser } = useUserStore()

  const handleSearch = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const username = formData.get('username')

    try {
      const UserRef = collection(db, 'users')
      console.log(UserRef);
      const q = query(UserRef, where("username", "==", username))
      console.log(q);
      const querySnapShot = await getDocs(q)
      console.log(querySnapShot.empty);
      if (!querySnapShot.empty) {
        console.log("not");
        setUser(querySnapShot.docs[0].data())
      }

    } catch (error) {
      console.log(error);
    }
  }
  const handleAdd = async () => {

    const chatRef = collection(db, "chats")
    const userChatsRef = collection(db, "userchats")

    try {
      const newChatRef = doc(chatRef)
      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: []
      })
      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: currentuser.id,
          updatedAt: Date.now()
        })
      })
      

      await updateDoc(doc(userChatsRef, currentuser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: '',
          receiverId: user.id,
          updatedAt: Date.now()
        })
      })
      data(false)
      console.log("add");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='w-max h-max p-10 absolute left-0 bottom-0 right-0 top-0 m-auto gap-5 flex flex-col' style={{ backgroundColor: "rgba(12,24,25,0.5)" }}>
      <form className='gap-2 flex' onSubmit={handleSearch}>
        <input type="text" className='bg-slate-500 px-3 py-2 outline-none border-none rounded' name='username' placeholder='Username' />
        <button className='bg-sky-600 px-5 py-2 rounded'>Search</button>
      </form>


      <div className='gap-2 flex justify-between'>
        {user &&
          <>
            <div className='flex items-center gap-3'>
              <img src={user.avatar || "./avatar.jpg"} alt="" className='w-8 rounded-full h-8' />
              <p className='font-bold'>{user.username}</p>
            </div>
            <button className='bg-sky-600 px-3 py-1 rounded' onClick={handleAdd}>Add User</button>
          </>
        }
      </div>



    </div>
  )
}

export default AddChat