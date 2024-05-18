import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from './lib/firebase'
import { doc, setDoc } from 'firebase/firestore'

import Upload from './lib/Upload'

function Login() {
    const [loading, setLoading] = useState(false)
    const [avatar, setAvatar] = useState({
        file: null,
        url: ''
    })

    const handleAvatar = e => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }

    }

    const handleSignUp = async (e) => {
        setLoading(true)
        e.preventDefault()
        const formData = new FormData(e.target)
        console.log(formData);
        const { username, email, password } = Object.fromEntries(formData)

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const imgUrl = await Upload(avatar.file)

            await setDoc(doc(db, 'users', res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: []

            })
            await setDoc(doc(db, 'userchats', res.user.uid), {
                chats: []

            })
            alert("Account Created")
        }
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false)
        }
    }

    const handleSignIn = async (e) => {
        e.preventDefault()
        setLoading(true)
        const formData = new FormData(e.target)
        const { email, password } = Object.fromEntries(formData)
        
        try {
            const res = await signInWithEmailAndPassword(auth, email, password)
            console.log("loginned");
        }   
        catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false)
        }
    }


    return (

        <>
            <div className='flex flex-col justify-center items-center gap-3'>
                <h3 className='text-2xl font-bold'>Welcome back</h3>
                <form onSubmit={handleSignIn} className='flex flex-col justify-center items-center gap-3'>
                    <input type="text" className='bg-slate-500 px-3 py-2 outline-none border-none' name='email' placeholder='Email' />
                    <input type="password" className='bg-slate-500 px-3 py-2 outline-none border-none' name='password' placeholder='password' />
                    <button className='bg-sky-600 px-5 py-2 rounded' disabled={loading}>Sign In</button>
                </form>
            </div>

            <div className='w-px bg-stone-400'>

            </div>
            <div className='flex flex-col justify-center items-center gap-3'>

                <h3 className='text-2xl font-bold'>Create an Account</h3>
                <form onSubmit={handleSignUp} className='flex flex-col justify-center items-center gap-3'>
                    <label htmlFor="file" className='flex gap-2'>
                        <img src={avatar.url || "./avatar.jpg"} alt="" className='w-6 rounded' />
                        Upload Image
                    </label>
                    <input type="file" className='hidden' id='file' onChange={handleAvatar} />
                    <input type="text" className='bg-slate-500 px-3 py-2 outline-none border-none' name='username' placeholder='Username' />
                    <input type="text" className='bg-slate-500 px-3 py-2 outline-none border-none' name='email' placeholder='Email' />
                    <input type="password" className='bg-slate-500 px-3 py-2 outline-none border-none' name='password' placeholder='Password' />
                    <button className='bg-sky-600 px-5 py-2 rounded' disable={loading} >Sign Up</button>
                </form>
            </div>

        </>

    )
}

export default Login