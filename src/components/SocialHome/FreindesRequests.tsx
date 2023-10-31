import {ReactElement, useEffect, useState,lazy} from 'react'
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
import { baseResponseType, baseUrl, requestType, userType } from '../../types/type';
import api from '../../utils/axiosModule';
import Swal from 'sweetalert2';
import {toast} from 'react-toastify';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
import { useNavigate } from 'react-router-dom';
function FreindesRequests():ReactElement {
    const [requests,setRequests] = useState<requestType[]|null>(null);
    const [error,setError] = useState<boolean>(false);
    const Navigate = useNavigate();
    const user:userType = useSelector<reducerType>(state=>state.auth.user) as userType;
    useEffect(()=>{
        let check = true;
        if(user){
            (async()=>{
                try{
                    const url = baseUrl+`/user/getFriendsRequests`;
                    const {data}:{data:baseResponseType&{friends:requestType[]}} = await api.get(url,{
                        withCredentials:true,
                    });
                    if(data.status&&check&&data.friends){
                        setRequests(data.friends);
                    }else{
                        setError(true);
                    }
                }catch(e){
                    console.log(e);
                    setError(true);
                }
            })()
            const connection = io(baseUrl);
            connection.on(`friendsrequests/${user.id}`,(data=>{
                if(data.action==="add"){
                    setRequests(requests=>{
                        if(requests){
                            const newRequests = [data.friend,...requests];
                            return newRequests;
                        }else{
                            return [data.friend];
                        }
                    })
                }
            }));
            return()=>{
                connection.close();
                check = false;
            }
        }
      },[user]);
  return (
    <ErrorBoundary error={error}>
        <LoadingBoundary loading={(requests===null)?true:false}>
            <>
                <p className='w-full bg-white rounded-t p-1 underline text-slate-500 font-bold text-xl flex items-center'><svg className="mx-1 text-3xl" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"></path></svg><span className='text-primary'>My Requests</span></p>
                {(requests)?<section className='w-full p-1 rounded  bg-white rounded-t-none'>{(requests as requestType[]).map((el:requestType)=>{
                return(
                    <article key={el.id+el.createdAt} className='w-full px-2 py-1 flex justify-start items-center flex-col'>
                    <div className='flex w-full justify-start items-center'>
                        <img onClick={()=>{
                            Navigate(`/home/users/${el.friendId}`);
                        }} className='rounded-full cursor-pointer w-[50px] h-[50px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+el.image} alt="personalImage" />
                        <p className='p-0 m-0 ms-1 font-bold text-sm'>{el.name}</p>
                        <div className='ms-auto text-3xl flex justify-start items-center gap-2'>
                            <svg onClick={()=>{
                                (async()=>{
                                    try{
                                        const url = baseUrl+`/user/acceptFriend/${el.userId}`;
                                        const {data}:{data:baseResponseType} = await api.get(url,{
                                            withCredentials:true,
                                        });
                                        if(data.status){
                                            setRequests((friends:requestType[]|null)=>{
                                                if(friends){
                                                    const filterationRequests = friends.filter((element:requestType)=>{
                                                        return element.id!==el.id;
                                                    });
                                                    return filterationRequests;
                                                }
                                                return null;
                                            });
                                            toast.success('request canceled successfully', {
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
                                            setError(true);
                                            toast.error('request canceled failed', {
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
                                        toast.error('request canceled failed', {
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
                            }} className="cursor-pointer transition duration-300 hover:text-primary" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M8 12.052c1.995 0 3.5-1.505 3.5-3.5s-1.505-3.5-3.5-3.5-3.5 1.505-3.5 3.5 1.505 3.5 3.5 3.5zM9 13H7c-2.757 0-5 2.243-5 5v1h12v-1c0-2.757-2.243-5-5-5zm11.294-4.708-4.3 4.292-1.292-1.292-1.414 1.414 2.706 2.704 5.712-5.702z"></path></svg>
                            <svg onClick={()=>{
                                Swal.fire({
                                title: 'Are you sure?',
                                text: "You won't be able to revert this!",
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonColor: '#3085d6',
                                cancelButtonColor: '#d33',
                                confirmButtonText: 'Yes, delete it!'
                              }).then((result) => {
                                if (result.isConfirmed) {
                                    (async()=>{
                                        try{
                                            const url = baseUrl+`/user/cancelFriend/${el.userId}`;
                                            const {data}:{data:baseResponseType} = await api.get(url,{
                                                withCredentials:true,
                                            });
                                            if(data.status){
                                                setRequests((friends:requestType[]|null)=>{
                                                    if(friends){
                                                        const filterationRequests = friends.filter((element:requestType)=>{
                                                            return element.id!==el.id;
                                                        });
                                                        return filterationRequests;
                                                    }
                                                    return null;
                                                });
                                                toast.success('request canceled successfully', {
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
                                                setError(true);
                                                toast.error('request canceled failed', {
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
                                            toast.error('request canceled failed', {
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
                                }
                              })
                            }} className="cursor-pointer transition duration-300 hover:text-red-500" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="m15.71 15.71 2.29-2.3 2.29 2.3 1.42-1.42-2.3-2.29 2.3-2.29-1.42-1.42-2.29 2.3-2.29-2.3-1.42 1.42L16.58 12l-2.29 2.29zM12 8a3.91 3.91 0 0 0-4-4 3.91 3.91 0 0 0-4 4 3.91 3.91 0 0 0 4 4 3.91 3.91 0 0 0 4-4zM6 8a1.91 1.91 0 0 1 2-2 1.91 1.91 0 0 1 2 2 1.91 1.91 0 0 1-2 2 1.91 1.91 0 0 1-2-2zM4 18a3 3 0 0 1 3-3h2a3 3 0 0 1 3 3v1h2v-1a5 5 0 0 0-5-5H7a5 5 0 0 0-5 5v1h2z"></path></svg>
                        </div>
                    </div>
                    <hr className='w-full border-slate-400 mt-3'/>
                    </article>
                )
                })}</section>:<p className='w-full text-center'>No Friends</p>}
            </>
        </LoadingBoundary>
    </ErrorBoundary>
  )
}
export default FreindesRequests;