import {ReactElement,useMemo, useState} from 'react'
import { baseResponseType, baseUrl, notificationType } from '../../types/type';
import like from '../../assets/reactions/like.ico'
import love from '../../assets/reactions/love.ico'
import haha from '../../assets/reactions/haha.ico'
import sad from '../../assets/reactions/sad.ico'
import wow from '../../assets/reactions/wow.ico'
import angry from '../../assets/reactions/angry.ico'
import api from '../../utils/axiosModule';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { disptachType } from '../../store/store';
import { removeNotification } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
export default function SingleNotification({notification}:{notification:notificationType}):ReactElement {
  const reactions:{[key:string]:string} = useMemo(()=>{
    return {
        "like":like,
        "love":love,
        "haha":haha,
        "wow":wow,
        "sad":sad,
        "angry":angry,
    };
  },[]);
  const Navigate = useNavigate();
  const dispatch = useDispatch<disptachType>();
  const [seened,setSeened] = useState<boolean>(notification.seen);
  return (
    <div onClick={()=>{
      Navigate(`/posts/${notification.postId}`);
    }} className='w-full cursor-pointer flex justify-start items-start flex-col'>
        <div  className={`px-3 py-2 w-full flex justify-start items-start ${(seened)?"bg-white":"bg-blue-300"} flex-col cursor-pointer`} onClick={async()=>{
            try{
                const url = baseUrl+`/user/${(notification.type)?"seeLike":"seeComment"}/${notification.id}`;
                const {data}:{data:baseResponseType} = await api.get(url,{
                  withCredentials:true,
                });
                if(data.status){
                    setSeened(true);   
                    dispatch(removeNotification());
                }
            }catch(e){
              if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                toast.error(`server error`,{
                    position: "bottom-left",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
              }
            } 
        }}>
                  <div className={`w-full flex justify-start items-start ${(seened)?"bg-white":"bg-blue-300"}  pb-2`}>
                        <img className='w-[60px] h-[60px] object-cover rounded-full' src={import.meta.env.VITE_BASU_URL_API+'/images/'+notification.userImage} alt="personalImage" />
                        <div className='w-full flex justify-start items-start flex-col rounded-md ms-2 rounded-tl-none'>
                            <div className='w-full flex justify-between items-center'>
                                <div className='flex items-center ms-auto my-auto m-0 p-0'>
                                        <span className='text-sm font-normal'>{new Date(notification.createdAt).toLocaleString()}</span>
                                        <svg className={'ms-1'} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.293 14.707L11 12.414V6h2v5.586l3.707 3.707-1.414 1.414z"></path></svg>
                                </div>
                            </div>  
                            <p className='text-lg font-normal m-0 p-0'>{(notification.type)?`${notification.name}reacted to your recent post`:`${notification.name}reacted to your recent post`} :</p>
                            <div className='w-full mt-1 '>
                                {(notification.content)&&<span className='truncate p-2 rounded-t-md border-slate-400 border-2 border-solid flex items-center'><svg className="me-1 text-primary" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M448 0H64C28.7 0 0 28.7 0 64v288c0 35.3 28.7 64 64 64h96v84c0 9.8 11.2 15.5 19.1 9.7L304 416h144c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64z"></path></svg>{(notification.content)}</span>}
                                {(notification.type)&&<div className=' p-2 rounded-t-md border-slate-400 border-2 border-solid flex items-center'><img className='w-[20px] h-[20px] ' src={reactions[`${notification.type}`]} alt={notification.type} /></div>}
                                <div className='w-full flex justify-start items-start bg-slate-300 rounded-b-md border-slate-400 border-2 border-solid border-t-0'>
                                    {(notification.postImage)&&<img className='w-[200px] object-cover h-[200px] ' src={import.meta.env.VITE_BASU_URL_API+'/images/'+notification.postImage} alt="postImage" />}
                                    <span className={` grow my-auto ps-2`}>{(notification.postContent)}</span>
                                </div>
                            </div>
                        </div>
                  </div>
        </div>
        <hr className='w-full border-slate-300' />
    </div>
  )
}
