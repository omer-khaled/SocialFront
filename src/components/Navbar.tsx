import {ReactElement, useEffect,useRef} from 'react'
import { Link, NavLink } from 'react-router-dom';
import { baseUrl, messageType, notificationType, userType } from '../types/type';
import { useDispatch, useSelector } from 'react-redux';
import { disptachType, reducerType } from '../store/store';
import { io } from 'socket.io-client';
import { addMessages, addNotification } from '../store/authSlice';
import notificationAudio from '../assets/notification/strong-minded-ringtone (mp3cut.net).mp3';
import { toast } from 'react-toastify';
function Navbar():ReactElement {
  const user:userType = useSelector<reducerType>(state=>state.auth.user) as userType;
  const notifications:number = useSelector<reducerType>(state=>state.auth.notifications) as number;
  const messages:number = useSelector<reducerType>(state=>state.auth.messages) as number;
  const dispatch = useDispatch<disptachType>();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(()=>{
    if(user){
      const connection = io(baseUrl);
      connection.on(`notifications/${user.id}`,(data:{action:string,notification:notificationType})=>{
          if(data.action==='create'){
              dispatch(addNotification());
              toast.info(`${(data.notification.content)?"comment":(data.notification.type?data.notification.type:'action')} on your post`, {
                  position: "bottom-right",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "dark",
                },);
                if (audioRef.current) {
                  audioRef.current.play();
                }
          }
      });
      connection.on(`messages/${user.id}`,(data:{action:string,message:messageType})=>{
        if(data.action==='create'){
            dispatch(addMessages());
            toast.info(`new Message from your friend`, {
                position: "bottom-right",
                autoClose: 500,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              },);
              if (audioRef.current) {
                audioRef.current.play();
              }
        }
    });
    }
  },[dispatch,user]);
  return (
    <header className='container lg:w-[1000px] xl:w-[1256px] 2xl:w-[1400px] shadow-lg z-[100] p-2 w-full flex justify-between items-center bg-white rounded-md sticky top-0'>
       <audio ref={audioRef} src={notificationAudio} />
      <Link to={'/home'} className='flex items-end'>
        <svg className={'text-5xl'} stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M19.829 22.075c-.064.192 2.63-2.76 2.63-2.76-.256-2.759-1.54-5.775-1.54-5.775-2.117-4.428-6.801-5.904-9.56-3.53-.129.065-.322.129-.45.193 2.118-2.952 6.93-2.695 10.075.963 0 0 1.412 1.732 2.438 4.363.257-.898.45-1.86.514-2.823-1.669-2.31-3.594-3.658-3.594-3.658-3.978-2.695-8.663-1.732-9.946 1.604-.129.193-.257.385-.321.578.385-3.594 4.684-5.84 9.176-4.3 0 0 2.182.835 4.428 2.631 0-.128-.064-.256-.128-.449-.257-.962-.578-1.86-1.027-2.695-2.567-1.155-4.877-1.347-4.877-1.347-4.877-.321-8.535 3.08-7.765 6.802v.513c-1.668-3.337.963-7.636 5.776-8.535 0 0 2.246-.385 5.005 0a11.844 11.844 0 0 0-2.374-1.989c-2.76.32-4.813 1.283-4.813 1.283-4.428 2.182-5.84 7.06-3.401 9.819.064.192.192.32.32.449-3.08-2.054-2.887-7.123.77-10.396 0 0 1.733-1.476 4.3-2.503C14.375.193 13.283 0 12.193 0 10.01 1.668 8.79 3.465 8.79 3.465c-2.759 4.171-1.604 9.113 1.99 10.268h.064c.128.064.192.128.32.192-3.657-.192-6.031-4.684-4.427-9.369 0 0 .77-2.053 2.374-4.171-.962.257-1.796.578-2.63 1.09-1.027 2.568-1.284 4.75-1.284 4.75-.321 4.94 3.016 8.599 6.61 7.893H12c.128 0 .257 0 .385-.065-3.273 1.669-7.444-1.026-8.406-5.903 0 0-.385-2.182 0-4.941-.77.77-1.476 1.604-2.054 2.63.321 2.696 1.284 4.685 1.284 4.685 2.181 4.492 6.994 5.968 9.754 3.401l.064-.064c.128-.064.256-.128.32-.257-1.989 3.145-6.994 3.016-10.203-.77 0 0-1.604-2.117-2.438-4.556 0-.064-.642 3.209-.642 3.209 1.604 1.925 3.658 3.529 3.658 3.529 3.979 2.695 8.663 1.668 9.946-1.668a1.39 1.39 0 0 0 .321-.514c-.385 3.594-4.684 5.84-9.176 4.236 0 0-1.99-.77-4.107-2.439 0 .064.064.193.064.257a15.14 15.14 0 0 0 1.091 2.823c2.438 1.027 4.62 1.22 4.62 1.22 4.877.32 8.47-3.08 7.765-6.674v-.514c1.54 3.337-1.09 7.508-5.84 8.47 0 0-2.117.386-4.748 0a11.229 11.229 0 0 0 2.117 1.798c2.76-.321 4.813-1.284 4.813-1.284 4.3-2.117 5.776-6.802 3.53-9.625-.065-.193-.193-.385-.321-.578 2.952 2.118 2.76 7.059-.899 10.267 0 0-1.796 1.476-4.427 2.567 1.026.321 2.117.578 3.208.642 2.246-1.733 3.594-3.658 3.594-3.658 2.76-4.17 1.604-9.112-1.925-10.267a1.04 1.04 0 0 0-.45-.257c3.722.193 6.032 4.685 4.428 9.37 0 0-.77 2.245-2.567 4.491.129 0 .257-.064.45-.128a17.58 17.58 0 0 0 2.566-.963c1.091-2.63 1.284-4.94 1.284-4.94.32-4.878-2.888-8.472-6.417-7.958-.129 0-.321-.064-.45-.064h-.128c3.273-1.412 7.316 1.219 8.214 5.968 0 0 .578 2.246.128 4.94-.064.386-.256.963-.577 1.54z"></path></svg>
        <span className='ms-1 text-2xl'>Media</span>
      </Link>
      <nav>
          <ul className='list-none flex justify-center items-center gap-3'>
            <NavLink to={'/home'} end className={({isActive})=>{
              const style = "p-1 flex flex-col justify-center items-center hover:text-primary";
              return (isActive)?`${style} bg-slate-200 rounded`:`${style}`;
            }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M946.5 505L534.6 93.4a31.93 31.93 0 0 0-45.2 0L77.5 505c-12 12-18.8 28.3-18.8 45.3 0 35.3 28.7 64 64 64h43.4V908c0 17.7 14.3 32 32 32H448V716h112v224h265.9c17.7 0 32-14.3 32-32V614.3h43.4c17 0 33.3-6.7 45.3-18.8 24.9-25 24.9-65.5-.1-90.5z"></path></svg>
              <span className='text-sm'>Home</span>
            </NavLink>
            <NavLink to={'/home/message'} end className={({isActive})=>{
              const style = "p-1 flex flex-col justify-center items-center hover:text-primary relative";
              return (isActive)?`${style} bg-slate-200 rounded`:`${style}`;
            }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title></title><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zM4.911 7.089h11.456a2.197 2.197 0 0 1 2.165 2.19v5.863a2.213 2.213 0 0 1-2.177 2.178H8.04c-1.174 0-2.04-.99-2.04-2.178v-4.639L4.503 7.905c-.31-.42-.05-.816.408-.816zm3.415 2.19c-.347 0-.68.21-.68.544 0 .334.333.544.68.544h7.905c.346 0 .68-.21.68-.544 0-.334-.334-.545-.68-.545zm0 2.177c-.347 0-.68.21-.68.544 0 .334.333.544.68.544h7.905c.346 0 .68-.21.68-.544 0-.334-.334-.544-.68-.544zm-.013 2.19c-.346 0-.68.21-.68.544 0 .334.334.544.68.544h5.728c.347 0 .68-.21.68-.544 0-.334-.333-.545-.68-.545z"></path></svg>
              <span className='text-sm'>Message</span>
              {(messages>0)&&<span className='absolute right-0 top-0 z-[1000] -translate-y-[35%] translate-x-1/2 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center text-xs font-bold text-white'>{(messages<50)?messages:"50+"}</span>}
            </NavLink>
            <NavLink to={'/home/notification'} end className={({isActive})=>{
              const style = "p-1 flex flex-col justify-center items-center hover:text-primary relative";
              return (isActive)?`${style} bg-slate-200 rounded`:`${style}`;
            }}>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M255.9 456c31.1 0 48.1-22 48.1-53h-96.3c0 31 17 53 48.2 53zM412 352.2c-15.4-20.3-45.7-32.2-45.7-123.1 0-93.3-41.2-130.8-79.6-139.8-3.6-.9-6.2-2.1-6.2-5.9v-2.9c0-13.4-11-24.7-24.4-24.6-13.4-.2-24.4 11.2-24.4 24.6v2.9c0 3.7-2.6 5-6.2 5.9-38.5 9.1-79.6 46.5-79.6 139.8 0 90.9-30.3 102.7-45.7 123.1-9.9 13.1-.5 31.8 15.9 31.8h280.1c16.3 0 25.7-18.8 15.8-31.8z"></path></svg>
              <span className='text-sm'>Notifications</span>
              {(notifications>0)&&<span className='absolute right-0 top-0 z-[1000] -translate-y-[35%] translate-x-1/2 whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center text-xs font-bold text-white'>{(notifications<50)?notifications:"50+"}</span>}
            </NavLink>
          </ul>
      </nav>
    </header>
  )
}

export default Navbar;