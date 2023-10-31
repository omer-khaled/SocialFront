import {ReactElement,useState,useEffect, lazy,Suspense} from 'react'
import { baseResponseType, baseUrl, friendType, messageType, userType } from '../../types/type';
import api from '../../utils/axiosModule';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { disptachType, reducerType } from '../../store/store';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const UserCardChat = lazy(()=>import('./UserCardChat'));
export const ChatMessages = lazy(()=>import('./ChatMessages'));
export const FriendMessage = lazy(()=>import('./FriendMessage'));
import chatImage from '../../assets/wired-flat-981-consultation-unscreen.gif';
import { removeMessages } from '../../store/authSlice';
import Loading from '../Loading';
function Chats():ReactElement {
    const [friends,setFriends] = useState<friendType[]|null>(null);
    const [chat,setChat] = useState<messageType[]|null>(null);
    const [chatError,setChatError] = useState<boolean>(false);
    const [error,setError] = useState<boolean>(false);
    const [checked,setChecked] = useState<friendType|null>(null);
    const user = (useSelector<reducerType>(state=>state.auth.user) as userType);
    const dispatch = useDispatch<disptachType>();
    useEffect(()=>{
        let check = true;
        (async()=>{
            try{
                const url = baseUrl+`/user/getFriendsChats`;
                const {data}:{data:baseResponseType&{friends:friendType[]}} = await api.get(url,{
                    withCredentials:true,
                });
                if(data.status&&check&&data.friends){
                    setFriends(data.friends);   
                }
            }catch(e){
                setError(true);
            } 
        })()
        return()=>{
            check = false;
        }
    },[setFriends,user]);
    useEffect(()=>{
        let check = true;
        if(checked){
            (async()=>{
                try{
                    const url = baseUrl+`/messages/getMessage/${checked.friendId}`;
                    const {data}:{data:baseResponseType&{messages:messageType[]}} = await api.get(url,{
                        withCredentials:true,
                    });
                    if(data.status&&check&&data.messages){
                        setChat(data.messages);   
                    }
                }catch(e){
                    setChatError(true);
                } 
            })()
        }
        const connection = io(baseUrl);
        connection.on(`message/${user.id}-${checked?.friendId}`,(data:{action:string,message:messageType})=>{
            if(data.action==='create'){
                setChat((state)=>{
                    if(state===null){
                        return [data.message];
                    }else{
                        return [...state,data.message];
                    }
                });
            }
        }); 
        connection.on(`message/${checked?.friendId}-${user.id}`,(data:{action:string,message:messageType})=>{
            if(data.action==='create'){
                setChat((state)=>{
                    if(state===null){
                        return [data.message];
                    }else{
                        return [...state,data.message];
                    }
                });
            }
        });
        return(()=>{
            check = false;
            connection.close();
        })
    },[checked,user])
  return (
            <>
                <aside className='p-2 col-start-1 max-h-[85vh] overflow-auto col-end-5 flex flex-col justify-start bg-white rounded-l-lg'>
                <p className='w-full bg-primary p-1 mb-2 text-center text-white rounded text-2xl font-bold'>My Chats</p>
                <LoadingBoundary loading={(!friends)?true:false}>
                    <ErrorBoundary error={error}>
                        <>
                            {(friends)&&(friends.length===0)?<p className='text-center text-red-500'>Add new Friends to chat with them</p>:(friends)?.map((el:friendType)=>{
                                return(
                                        <FriendMessage userId={user.id} checked={checked} clickHandle={()=>{
                                            setChecked(el);
                                            dispatch(removeMessages());
                                        }} key={el.friendId} friend={el}/>
                                )
                            })}
                        </>
                    </ErrorBoundary>
                </LoadingBoundary>
                </aside>
                {(checked)?<section className='col-start-5 h-[85vh] col-end-13 ps-2 bg-slate-200 flex flex-col justify-start items-start'>
                    <UserCardChat user={checked}/>
                    <LoadingBoundary loading={!chat?true:false}>
                        <ErrorBoundary error={chatError}>
                            {(chat)?
                                <Suspense fallback={<Loading />}>    
                                    <ChatMessages chat={chat} myId={user.id} friendId={(checked.friendId).toString()}/>
                                </Suspense>
                            :<></>}
                        </ErrorBoundary>
                    </LoadingBoundary>
                </section>:<section className='col-start-5 col-end-13 h-[85vh] ps-2 flex justify-center items-center flex-col bg-slate-200'>
                    <img src={chatImage} alt={"chat image"} />
                    <p className='text-center font-bold text-lg tracking-wide'>send and recive message wthout keeping your phone online</p>
                </section>}
            </>
  )
}

export default Chats;