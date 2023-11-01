import {ReactElement,useState,useEffect,lazy} from 'react'
import { baseUrl, commentType, responsegetCommentsApi } from '../../types/type';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const CreateComment = lazy(()=>import('./CreateComment'));
import { io } from 'socket.io-client';
import api from '../../utils/axiosModule';

function Comments({postId}:{postId:number}):ReactElement {
    const [comments,setComments] = useState<commentType[]|null>(null);
    const [error,setError] = useState<boolean>(false);
    useEffect(()=>{
        let check = true;
        (async()=>{
            try{
                const url = baseUrl+`/comment/getComments/${postId}`;
                const {data}:{data:responsegetCommentsApi} = await api.get(url,{
                    withCredentials:true,
                });
                if(data.status&&check){
                    setComments(data.comments);
                }else{
                    setError(true);
                }
            }catch(e){
                setError(true);
            }
        })()
        const connection = io(baseUrl);
        connection.on(`comments/${postId}`,(data:{action:string,comment:commentType})=>{
            if(data.action==='create'){
                setComments((state)=>{
                    if(state===null){
                        return [data.comment];
                    }else{
                        return [data.comment,...state];
                    }
                })
            }
        })
        return()=>{
            check = false;
        }
    },[postId,setComments,setError]);
  return (
    <ErrorBoundary error={error}>
        <LoadingBoundary loading={(comments)?false:true}>
            <>
                <CreateComment postId={postId}/>
                {(comments)?<>
                    <hr className='w-full border-slate-300'/>
                    <section className='w-full flex flex-col justify-start items-start'>
                        {
                            comments.map((el:commentType)=>{
                                return (
                                    <article key={el.id} className='w-full flex justify-start items-start mt-2'>
                                        <img loading='lazy' className='rounded-full w-[50px] h-[50px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+el.userImage} alt="personalImage" />
                                        <div className='grow p-1 min-h-[70px] bg-slate-200 flex justify-start items-start flex-col rounded-md ms-2 rounded-tl-none'>
                                            <div className='w-full flex justify-between items-center'>
                                                <p className='text-lg font-bold'>{el.name}</p>
                                                <div className=' flex items-center my-auto'>
                                                        <span className='ms-2 text-sm font-normal'>{new Date(el.createdAt).toLocaleString()}</span>
                                                        <svg className={'ms-1'} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm3.293 14.707L11 12.414V6h2v5.586l3.707 3.707-1.414 1.414z"></path></svg>
                                                </div>
                                            </div>
                                            <p className='mt-1'>{el.content}</p>
                                        </div>
                                    </article>
                                )
                            })
                        }
                    </section>
                </>:<></>}
            </>
        </LoadingBoundary>
    </ErrorBoundary>
  )
}

export default Comments;