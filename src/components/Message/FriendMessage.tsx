import {ReactElement,useEffect,useState} from 'react'
import { baseUrl, friendType, messageType } from '../../types/type'
import { io } from 'socket.io-client';
import { disptachType } from '../../store/store';
import { useDispatch } from 'react-redux';

function FriendMessage({friend,clickHandle,checked,userId}:{userId:string,friend:friendType,clickHandle:()=>void,checked:number|null}):ReactElement {
    const [messageNumber,setMessageNumber] = useState<number>(friend.messageNumber||0);
    const dispatch = useDispatch<disptachType>();
    useEffect(()=>{
        const connection = io(baseUrl);
        connection.on(`message/${friend.friendId}-${userId}`,(data:{action:string,message:messageType})=>{
            if(data.action==='create'){
                setMessageNumber(state=>{
                    const newNumber = state+=1;
                    return newNumber;
                });
            }
        });
        if(checked?.toString()===friend.friendId.toString()){
            connection.close();
        }
        return(()=>{
            connection.close();
        })
    },[friend,userId,checked,dispatch])
  return (
    <div key={friend.friendId} onClick={()=>{
        clickHandle();
        setMessageNumber(0);
    }} className={`flex relative items-center cursor-pointer justify-start mt-2 px-2 py-1 ${checked===friend.friendId?"bg-primary text-white":"bg-slate-100 text-black"} rounded`}>
        <img className='w-[60px] h-[60px] object-cover rounded-full' src={import.meta.env.VITE_BASU_URL_API+'/images/'+friend.image} alt="personalImage" />
        <p className='font-bold ms-2'>{friend.name}</p>
        {(messageNumber)?<span className='absolute right-1 top-[50%] z-[1000] -translate-y-[50%] whitespace-nowrap rounded-full bg-red-500 px-2.5 py-1 text-center text-xs font-bold text-white'>{(messageNumber<50&&messageNumber!==0)?messageNumber:"50+"}</span>:<></>}
    </div>
  )
}
export default FriendMessage;
