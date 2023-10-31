import {ReactElement, useEffect, useState,lazy} from 'react'
import { baseResponseType, baseUrl, userType } from '../../types/type';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
import api from '../../utils/axiosModule';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
function UserProfileCard({id}:{id:string}):ReactElement {
  const [user,setUser] = useState<{user:userType,friend:boolean|null,me:boolean|null}|null>(null);
  const [error,setError] = useState<boolean>(false);
  const userDetails:userType = useSelector<reducerType>(state=>state.auth.user) as userType;
  useEffect(()=>{
    let check = true;
    (async()=>{
        try{
            const url = baseUrl+`/user/profile/${id}`;
            const {data}:{data:baseResponseType&{user:userType,me:boolean|null,friend:boolean|null}} = await api.get(url,{
                withCredentials:true,
            });
            if(data.status&&check){
                setUser(data);
            }else{
                setError(true);
            }
        }catch(e){
            setError(true);
        }
    })()
    const connection = io(baseUrl);
    connection.on(`friends/${id}`,(data=>{
        if(data.action==="add"){
            setUser(state=>{
                if(state&&(data.friend.friendId)===(userDetails.id)){
                   const newState =  {...state,friend:true};
                   return newState
                }
                return state;
            })
        }else if(data.action==='delete'){
            setUser(state=>{
                if(state&&(data.friend).toString()===(userDetails.id).toString()){
                   const newState =  {...state,friend:null};
                   return newState
                }
                return state;
            })
        }
    }));
    return()=>{
        check = false;
    }
  },[id,userDetails]);
  return (
    <ErrorBoundary error={error}>
      <LoadingBoundary loading={(user)?false:true}>
        <article className='w-full p-2 bg-white rounded-md'>
            {(user)&&<>
                <img className='rounded-full w-[70px] h-[70px] object-cover mx-auto' src={import.meta.env.VITE_BASU_URL_API+'/images/'+user.user.image} alt="personalImage" />
                {<h1 className='mt-2 text-center text-lg truncate font-bold'>{user.user.name}</h1>}
                <hr className='my-2 border-slate-300'/>
                {(user.me)?<></>:((user.friend==true||user.friend==false)?((user.friend)?<span className='bg-primary mx-auto text-white p-2 rounded-md mt-1 flex items-center w-fit'>already friend <svg className="ms-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.29 8.29 16 12.58l-1.3-1.29-1.41 1.42 2.7 2.7 5.72-5.7zM4 8a3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4zm6 0a1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z"></path></svg></span>:<span className='bg-green-600 mx-auto text-white p-2 rounded-md mt-1 flex items-center w-fit'>await acceptance <svg className="ms-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M14 11h8v2h-8zM8 4a3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4 3.91 3.91 0 0 0-4-4zm0 6a1.91 1.91 0 0 1-2-2 1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2 1.91 1.91 0 0 1-2 2zm-4 8a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z"></path></svg></span>):<span className=' bg-slate-500 mx-auto text-white p-2 rounded-md mt-1 flex items-center w-fit cursor-pointer' onClick={()=>{
                    (async()=>{
                      try{
                          const url = baseUrl+`/user/addFriend/${id}`;
                          const {data}:{data:baseResponseType} = await api.get(url,{
                              withCredentials:true,
                          });
                          if(data.status){
                              setUser(state=>{
                                if(state){
                                   const newState =  {...state,friend:false};
                                   return newState
                                }
                                return state;
                              })
                              toast.success('add Friend successfully', {
                                  position: "bottom-left",
                                  autoClose: 200,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                              });
                          }else{
                              toast.error('add Friend  failed', {
                                  position: "bottom-left",
                                  autoClose: 200,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                  progress: undefined,
                                  theme: "light",
                              });
                          }
                      }catch(e){
                          setError(true);
                          toast.error('add Friend failed', {
                              position: "bottom-left",
                              autoClose: 200,
                              hideProgressBar: false,
                              closeOnClick: true,
                              pauseOnHover: true,
                              draggable: true,
                              progress: undefined,
                              theme: "light",
                          });
                      }
                    })()
                }}>add friend <svg className="ms-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM504 312V248H440c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V136c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H552v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"></path></svg></span>)}
            </>}
        </article>
      </LoadingBoundary>
    </ErrorBoundary>
  )
}

export default UserProfileCard;