import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import ChatDetails from './ChatDetails';
import ChatList from './ChatList';
import Login from './Login';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';
import { ToastContainer } from 'react-toastify';

function App() {

  const [openUserDetail, setOpenUserDetail] = useState(false);
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
    <div className="App  bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex justify-center items-center text-white">
      <div className='flex shadow-[rgba(6,_24,_44,_0.4)_0px_0px_0px_2px,_rgba(6,_24,_44,_0.65)_0px_4px_6px_-1px,_rgba(255,_255,_255,_0.08)_0px_1px_0px_inset] flex-col sm:flex-row w-[90%] sm:w-[90%] bg-neutral-800 bg-opacity-50 backdrop-blur-sm min-h-[70%] rounded-2xl gap-5  shadow-2xl'>
        {currentuser ? (
          <div className="flex flex-col sm:flex-row flex-1">
            <ChatList />
            
            {chatId && <Chat data={setOpenUserDetail}/>}
            
            {chatId && <ChatDetails data={openUserDetail} />}
          </div>
        ) : (
          <Login />
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
