import {ReactElement,useState,useEffect,useMemo,lazy} from 'react'
import { baseResponseType, baseUrl, commentType, likeType, postType, userType } from '../../types/type';
import { LinkedinShareButton } from 'react-share';
import { FacebookSelector } from '@charkour/react-reactions';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import api from '../../utils/axiosModule';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
export const Comments = lazy(()=>import('./Comments'));
export const Likes = lazy(()=>import('./Likes'));
export const UpdatePost = lazy(()=>import('./UpdatePost'));
export const CustomLoadingImage = lazy(()=>import('./CustomLoadingImage'));
import like from '../../assets/reactions/like.ico'
import love from '../../assets/reactions/love.ico'
import haha from '../../assets/reactions/haha.ico'
import sad from '../../assets/reactions/sad.ico'
import wow from '../../assets/reactions/wow.ico'
import angry from '../../assets/reactions/angry.ico'
function PostCard({post,showAll}:{post:postType,showAll:boolean|null}):ReactElement {
  const [openComments,setOpenComments] = useState<boolean>((showAll)?true:false);
  const [openUpdatePost,setOpenUpdatePost] = useState<boolean>(false);
  const [openLikes,setOpenLikes] = useState<boolean>(false);
  const [numberOfLikes,setNumberOfLikes] = useState<number>(post.numberOfLikes||0);
  const [numberOfComments,setNumberOfComments] = useState<number>(post.numberOfcomments||0);
  const [userLiked,setUserLiked] = useState<boolean>(post.userLiked);
  const [likeType,setLikeType] = useState<string|null>(post.LikeType);
  const user:userType = useSelector<reducerType>(state=>state.auth.user) as userType;
  const reactions:{[key:string]:string} = useMemo(()=>{
    return {
        "like":like,
        "love":love,
        "haha":haha,
        "wow":wow,
        "sad":sad,
        "angry":angry,
    };
    },[])
  const Navigate = useNavigate();
  useEffect(()=>{
    const connection = io(baseUrl);
    connection.on(`likes/${post.id}`,(data:{action:string,like:likeType})=>{
        if(data.action==='create'){
           setNumberOfLikes(likes=>{
                const newNumber =  likes+1;
                return newNumber;
           })
        }
        if(data.action==='deleted'){
           setNumberOfLikes(likes=>{
                const newNumber =  likes-1;
                return newNumber;
           });
           setUserLiked(false);
           setLikeType(null);
        }
    });
    return ()=>{
        if(connection){
            connection.close();
        }
    }
  },[setNumberOfLikes,post])
  useEffect(()=>{
    const connection = io(baseUrl);
    connection.on(`comments/${post.id}`,(data:{action:string,comment:commentType})=>{
        if(data.action==='create'){
            setNumberOfComments(comments=>{
                const newNumber =  comments+1;
                return newNumber;
           })
        }
    });
    return()=>{
        if(connection){
            connection.close();
        }
    }
  },[setNumberOfComments,post])
  return (
    <>
        <article className='w-full mb-3 p-2 shadow flex flex-col justify-start items-start relative  bg-white rounded'>
            {(user&&(user.id).toString()===(post.userId).toString())&&(<div className='group absolute top-1 right-2 text-md cursor-pointer'>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path></svg>
                <div className='absolute min-w-[100px] top-3 right-0 bg-slate-100 shadow-2xl p-2 invisible group-hover:visible  rounded-md flex flex-col'>
                    <span className='w-full flex items-center transition duration-150 hover:bg-primary hover:text-white p-1 rounded-sm' onClick={()=>{
                        setOpenUpdatePost(true);
                        document.body.classList.add('no-scroll');
                    }}><svg className='me-1' stroke="currentColor" fill="currentColor" strokeWidth="0" version="1.1" viewBox="0 0 17 17" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g></g><path d="M11.667 0h-8.651v1.984h-0.516c-0.827 0-1.5 0.673-1.5 1.5v8.588l2.521 4.956 2.464-4.959v-8.585c0-0.827-0.673-1.5-1.5-1.5h-0.469v-0.984h6.984v5h5v10h-11.5v1h12.5v-11.692l-5.333-5.308zM3.908 14.002h-0.804l-1.104-2.17v-5.848h1v6.027h1v-6.027h0.984v5.851l-1.076 2.167zM4.984 3.484v1.5h-2.984v-1.5c0-0.275 0.225-0.5 0.5-0.5h1.984c0.276 0 0.5 0.225 0.5 0.5zM12 1.742l3.273 3.258h-3.273v-3.258z"></path></svg>update</span>
                    <span className='w-full flex items-center transition duration-150 hover:bg-red-500 hover:text-white p-1 rounded-sm' onClick={()=>{
                        (async()=>{
                            try{
                                const url = baseUrl+`/post/deletePost/${post.id}`;
                                const {data}:{data:baseResponseType} = await api.delete(url,{
                                    withCredentials:true,
                                });
                                if(data.status){
                                    toast.success(`post deleted successfully`,{
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
                            }catch(e){
                                if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                                    toast.error(`post deleted failed`,{
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
                        })()
                    }}><svg className='me-1' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M864 256H736v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zm-200 0H360v-72h304v72z"></path></svg>delete</span>
                </div>
            </div>)}
            <div className='w-full flex justify-between items-start mb-2'>
            <div className='flex cursor-pointer justify-start items-start'  onClick={()=>{
                        Navigate(`/home/users/${post.userId}`);
                    }} >
                    <img className='rounded-full w-[70px] h-[70px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+post.userImage} alt="personalImage" />
                    <div className='flex flex-col my-auto'>
                        <span className='ms-2 text-lg font-bold'>{post.name}</span>
                        <div className='flex items-center'>
                            <span className='ms-2 text-sm font-light'>{new Date(post.createdAt).toDateString()}</span>
                            <svg className={'ms-1'} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zM4 12c0-.899.156-1.762.431-2.569L6 11l2 2v2l2 2 1 1v1.931C7.061 19.436 4 16.072 4 12zm14.33 4.873C17.677 16.347 16.687 16 16 16v-1a2 2 0 0 0-2-2h-4v-3a2 2 0 0 0 2-2V7h1a2 2 0 0 0 2-2v-.411C17.928 5.778 20 8.65 20 12a7.947 7.947 0 0 1-1.67 4.873z"></path></svg>
                        </div>
                    </div>
            </div>
                <div className='flex items-center my-auto'>
                        <span className='ms-2 text-sm font-normal'>{new Date(post.createdAt).toLocaleTimeString()}</span>
                        <svg className={'ms-1'} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.293 14.707L11 12.414V6h2v5.586l3.707 3.707-1.414 1.414z"></path></svg>
                </div>
            </div>
            <p className='text-md m-0 ps-1 mb-2'>{post.content}</p>
            {(post.postImage)&&<CustomLoadingImage src={import.meta.env.VITE_BASU_URL_API+'/images/'+post.postImage} alt={"post image"}/>}
            <hr  className='mt-2 w-full border-slate-300'/>
            <div className='w-full flex justify-between items-center pt-2 px-3'>
                <div className='flex items-center  text-lg  cursor-pointer' onClick={()=>{
                    setOpenLikes(true);
                    document.body.classList.add('no-scroll');
                }}>
                    {numberOfLikes||0} reactions
                </div>
                <span className=' cursor-pointer' onClick={()=>{
                    setOpenComments(!openComments);
                }}>{numberOfComments||0} comments</span>
            </div>
            <footer className='w-full text-xl flex justify-between items-center relative'>
                <div className='w-1/3 p-2 ps-3 cursor-pointer'>
                    <div className='w-fit flex items-center group'>
                        <div className='absolute bottom-0 invisible transition-all duration-300 left-0 group-hover:bottom-12 group-hover:visible'>
                            <FacebookSelector iconSize={25} onSelect={async(el)=>{
                                await(async()=>{
                                    try{
                                        const url = baseUrl+`/like/createLike?postId=${post.id}`;
                                        const {data}:{data:baseResponseType} = await api.post(url,JSON.stringify({
                                            type:el
                                        }),{
                                            headers:{
                                                "Content-Type":"application/json"
                                            },
                                            withCredentials:true,
                                        });
                                        if(data.status){
                                            setUserLiked(true);
                                            setLikeType(el);
                                            toast.success(`${el} added successfully`,{
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
                                    }catch(e){
                                        if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                                            toast.error(`${el} added failed`,{
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
                                })()
                            }} />
                        </div>
                        {(userLiked)?<div className={`flex items-center w-full  ${(likeType)?`text-${likeType}`:''}`}>
                            {(likeType)&&<img className='w-[20px] h-[20px] me-1' src={reactions[likeType]} alt={likeType} />}
                            <span>{likeType}</span>
                        </div>:<>
                        <svg className="me-1" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311h-.3v428h472.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM112 528v364c0 17.7 14.3 32 32 32h65V496h-65c-17.7 0-32 14.3-32 32z"></path></svg>
                        <span>like</span></>}
                    </div>
                </div>
                <div onClick={()=>{
                    setOpenComments(!openComments);
                }} className='flex items-center w-1/3 p-2 cursor-pointer'>
                    <svg className="me-1" stroke="currentColor" fill="currentColor" strokeWidth="0" target="1569682881658" viewBox="0 0 1024 1024" version="1.1" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><defs></defs><path d="M573 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40zM293 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"></path><path d="M894 345c-48.1-66-115.3-110.1-189-130v0.1c-17.1-19-36.4-36.5-58-52.1-163.7-119-393.5-82.7-513 81-96.3 133-92.2 311.9 6 439l0.8 132.6c0 3.2 0.5 6.4 1.5 9.4 5.3 16.9 23.3 26.2 40.1 20.9L309 806c33.5 11.9 68.1 18.7 102.5 20.6l-0.5 0.4c89.1 64.9 205.9 84.4 313 49l127.1 41.4c3.2 1 6.5 1.6 9.9 1.6 17.7 0 32-14.3 32-32V753c88.1-119.6 90.4-284.9 1-408zM323 735l-12-5-99 31-1-104-8-9c-84.6-103.2-90.2-251.9-11-361 96.4-132.2 281.2-161.4 413-66 132.2 96.1 161.5 280.6 66 412-80.1 109.9-223.5 150.5-348 102z m505-17l-8 10 1 104-98-33-12 5c-56 20.8-115.7 22.5-171 7l-0.2-0.1C613.7 788.2 680.7 742.2 729 676c76.4-105.3 88.8-237.6 44.4-350.4l0.6 0.4c23 16.5 44.1 37.1 62 62 72.6 99.6 68.5 235.2-8 330z"></path><path d="M433 421c-23.1 0-41 17.9-41 40s17.9 40 41 40c21.1 0 39-17.9 39-40s-17.9-40-39-40z"></path></svg> 
                    <span>comment</span>
                </div>
                <div className='flex items-center w-1/3 p-2 pe-3 cursor-pointer'>
                    <div onClick={
                            ()=>{
                                window.navigator.clipboard.writeText(`http://localhost:5173/home/posts/${post.id}`).then(()=>{
                                toast.success(`link copied successfully`,{
                                        position: "bottom-left",
                                        autoClose: 500,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "light",
                                    });
                                })
                            }
                        } className='ms-auto rounded-full w-[32px] h-[32px] bg-slate-500  text-white flex justify-center items-center me-2'>
                        <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M574 665.4a8.03 8.03 0 0 0-11.3 0L446.5 781.6c-53.8 53.8-144.6 59.5-204 0-59.5-59.5-53.8-150.2 0-204l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3l-39.8-39.8a8.03 8.03 0 0 0-11.3 0L191.4 526.5c-84.6 84.6-84.6 221.5 0 306s221.5 84.6 306 0l116.2-116.2c3.1-3.1 3.1-8.2 0-11.3L574 665.4zm258.6-474c-84.6-84.6-221.5-84.6-306 0L410.3 307.6a8.03 8.03 0 0 0 0 11.3l39.7 39.7c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c53.8-53.8 144.6-59.5 204 0 59.5 59.5 53.8 150.2 0 204L665.3 562.6a8.03 8.03 0 0 0 0 11.3l39.8 39.8c3.1 3.1 8.2 3.1 11.3 0l116.2-116.2c84.5-84.6 84.5-221.5 0-306.1zM610.1 372.3a8.03 8.03 0 0 0-11.3 0L372.3 598.7a8.03 8.03 0 0 0 0 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l226.4-226.4c3.1-3.1 3.1-8.2 0-11.3l-39.5-39.6z"></path></svg>
                    </div>
                    <div className=''>
                        <LinkedinShareButton
                            url={`https://omer-khaled.github.io/OmerKhaled/`}
                            title={post.content}
                        >
                                <div className='ms-auto rounded-full w-[32px] h-[32px] bg-primary  text-white flex justify-center items-center me-2'>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zM349.3 793.7H230.6V411.9h118.7v381.8zm-59.3-434a68.8 68.8 0 1 1 68.8-68.8c-.1 38-30.9 68.8-68.8 68.8zm503.7 434H675.1V608c0-44.3-.8-101.2-61.7-101.2-61.7 0-71.2 48.2-71.2 98v188.9H423.7V411.9h113.8v52.2h1.6c15.8-30 54.5-61.7 112.3-61.7 120.2 0 142.3 79.1 142.3 181.9v209.4z"></path></svg>
                                </div>
                        </LinkedinShareButton>
                    </div>

                </div>
            </footer>
            {
                (openComments)&&<Comments postId={post.id}/>
            }
            {
                (openLikes)&&<Likes userId={user.id} postId={post.id} setOpenLikes={setOpenLikes}/>
            }
        </article>
        {
            (openUpdatePost)&&<UpdatePost setOpenCreatePost={setOpenUpdatePost} id={post.id}/>
        }

    </>
  )
}
export default PostCard;