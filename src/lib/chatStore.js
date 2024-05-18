import { doc, getDoc } from 'firebase/firestore'
import { create } from 'zustand'
import { db } from './firebase'
import { useUserStore } from './userStore'

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserBlocked: false,
    isRecieverBlocked: false,
    isLoading: true,
    changeChat: (chatId, user) => {
        const currentuser = useUserStore.getState().currentuser

        if (user.blocked.includes(currentuser.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: true,
                isRecieverBlocked: false,

            })
        }

        else if (currentuser.blocked.includes(user.id)) {
            return set({
                chatId,
                user: null,
                isCurrentUserBlocked: false,
                isRecieverBlocked: true,

            })
        }
        else {
            set({
                chatId,
                user,
                isCurrentUserBlocked: false,
                isRecieverBlocked: false,

            })
        }
    },
    changeBlock: () => {
        set(state => ({ ...state, isRecieverBlocked: !state.isRecieverBlocked }))
    }
}))