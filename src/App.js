// App.js
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
    <div className="App bg-slate-400 min-h-screen flex  justify-center items-center text-white">
      <div className='flex flex-col sm:flex-row w-[90%] sm:w-[80%] bg-neutral-600 min-h-[70%] rounded-2xl gap-5 p-5'>
        {currentuser ? (
          <>
            <div className="flex flex-col sm:flex-row flex-1">
              <ChatList />
              {chatId && <Chat />}
              {chatId && <ChatDetails />}
            </div>
          </>
        ) : (
          <Login />
        )}
      </div>
    </div>
  );
}

export default App;