import { useEffect } from 'react';
import './App.css';
import Chat from './Chat';
import ChatDetails from './ChatDetails';
import ChatList from './ChatList';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';

function App() {
  const { currentuser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  console.log(currentuser);

  return (
    <div className="App bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex justify-center items-center text-white">
      <div className='flex flex-col sm:flex-row w-[90%] sm:w-[70%] bg-neutral-800 bg-opacity-50 backdrop-blur-sm min-h-[70%] rounded-2xl gap-5 p-5 shadow-2xl'>
        {currentuser ? (
          <div className="flex flex-col sm:flex-row flex-1">
            <ChatList />
            <div className='w-px bg-stone-400'>

            </div>
            {chatId && <Chat />}
            <div className='w-px bg-stone-400  hidden md:block'>

            </div>
            {chatId && <ChatDetails />}
          </div>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}

export default App;
