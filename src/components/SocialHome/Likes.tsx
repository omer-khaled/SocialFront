import {ReactElement,useState,useEffect,useMemo, useCallback,lazy} from 'react'
import { baseResponseType, baseUrl, likeType, responsegetLikesApi } from '../../types/type';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
import like from '../../assets/reactions/like.ico'
import love from '../../assets/reactions/love.ico'
import haha from '../../assets/reactions/haha.ico'
import sad from '../../assets/reactions/sad.ico'
import wow from '../../assets/reactions/wow.ico'
import angry from '../../assets/reactions/angry.ico'
import { io } from 'socket.io-client';
import api from '../../utils/axiosModule';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

function Likes({postId,setOpenLikes,userId}:{postId:number,userId:string,setOpenLikes:React.Dispatch<React.SetStateAction<boolean>>}):ReactElement {
    const [likes,setLikes] = useState<likeType[]|null>(null);
    const [likeTypes,setLikeTypes] = useState<string[]>([]);
    const [error,setError] = useState<boolean>(false);

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
    useEffect(()=>{
        let check = true;
        (async()=>{
            try{
                const url = baseUrl+`/like/getLikes/${postId}`;
                const {data}:{data:responsegetLikesApi} = await api.get(url,{
                    withCredentials:true,
                });
                if(data.status&&check){
                    setLikes(data.likes);
                    setLikeTypes(data.likeTypes);
                }else{
                    setError(true);
                }
            }catch(e){
                setError(true);
            }
        })()
        const connection = io(baseUrl);
        connection.on(`likes/${postId}`,(data:{action:string,like:likeType})=>{
            if(data.action==='create'){
                setLikes((state)=>{
                    if(state===null){
                        return [data.like];
                    }else{
                        return [data.like,...state];
                    }
                })
            }
            else if(data.action==='deleted'){
                setLikes((state)=>{
                    if(state===null){
                        return state;
                    }else{
                        const newLikes = state.filter((el:likeType)=>{
                            return el.id.toString()!==data.like.toString();
                        })
                        return newLikes;
                    }
                })
            }
        })
        return()=>{
            connection.close();
            check = false;
        }
    },[postId,setLikes,setError]);
    const handleLike = useCallback(async(id:number)=>{
        try{
            const url = import.meta.env.VITE_BASU_URL_API+`/like/deleteLike/${id}`;
            const {data}:{data:baseResponseType} = await api.delete(url,{
                withCredentials:true,
            });
            if(data.status){
                toast.success(`reaction deleted successfully`,{
                    position: "bottom-left",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }else{
                toast.error(`reaction deleted failed`,{
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
                toast.error(`reaction deleted failed`,{
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
    },[]);
  return (
    <section className='w-full flex flex-col justify-start items-center z-[50]  bg-[#0000004e] inset-0 fixed'>
        <article className='bg-white p-5 rounded-md relative max-h-[40vh] overflow-auto min-w-[30vw] mt-[100px]'>
            <ErrorBoundary error={error}>
                <LoadingBoundary loading={(likes)?false:true}>
                    <>
                        {(likes)?<>
                                    <div className='mb-2 flex items-center'>{likes&&likes.length} <span className='ms-1 me-2'>Reactions</span> {
                                        (likeTypes.length>0)&&likeTypes.map((el,index)=>{
                                            return(<img loading='lazy' key={index} className='w-[20px] h-[20px]' src={reactions[el]} alt={el} />);
                                        })
                                    }</div>
                                    <hr className=' border-slate-300'/>
                                    <svg onClick={()=>{
                                        setOpenLikes(false);
                                        document.body.classList.remove('no-scroll');
                                    }} className="text-lg absolute top-2 right-2 text-red-500 cursor-pointer" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" fill-rule="evenodd" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"></path></svg>
                                    {
                                    (likes.length>0)?likes.map((el:likeType)=>{
                                            return (
                                                <article onClick={()=>{
                                                    if(el.userId.toString()===userId.toString()){
                                                        handleLike(el.id);
                                                    }
                                                }} key={el.id} className={`w-full flex justify-start items-start transition duration-200 cursor-pointer ${(el.userId.toString()===userId.toString())?'hover:bg-slate-200':""}`}>
                                                    <div className='relative'>
                                                        <img loading='lazy'  className='w-[60px] h-[60px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+el.userImage} alt="personalImage" />
                                                        <span className='absolute bottom-0 right-0'>
                                                            <img loading='lazy' className='w-[20px] h-[20px]' src={reactions[`${el.type}`]} alt={el.type} />
                                                        </span>
                                                    </div>
                                                    <div className='min-h-[70px] flex justify-start items-start flex-col rounded-md ms-2 rounded-tl-none'>
                                                        <div className='w-full'>
                                                            <p className='text-lg font-bold m-0 p-0'>{el.name}</p>
                                                            <div className='flex items-center my-auto m-0 p-0'>
                                                                    <span className='text-sm font-normal'>{new Date(el.createdAt).toLocaleString()}</span>
                                                                    <svg className={'ms-1'} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.293 14.707L11 12.414V6h2v5.586l3.707 3.707-1.414 1.414z"></path></svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </article>
                                            )
                                        }):<p className='text-center text-red-500'>No Reactions For This Post</p>
                                    }
                        </>:<></>}
                    </>
                </LoadingBoundary>
            </ErrorBoundary>
        </article>
    </section>
  )
}

export default Likes;