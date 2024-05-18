import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'

export const useUserStore = create((set) => ({
  currentuser: null,
  isLoading:true,
  fetchUserInfo:async(uid)=>{
    if(!uid) return set({currentuser:null,isLoading:false})


        try {
            const  docRef=doc(db,"users",uid)
            const docSnap= await getDoc(docRef)

            if(docSnap.exists()){
                set({currentuser:docSnap.data(),isLoading:false})
            }else{
                set({currentuser:null,isLoading:false})
            }
        } catch (error) {
            console.log(console.error)
            return set({currentuser:null,isLoading:false})
        }
  }
}))