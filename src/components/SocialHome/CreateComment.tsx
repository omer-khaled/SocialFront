import {ChangeEvent,useCallback, ReactElement,useState} from 'react'
import { responseCreatePostApi, userType } from '../../types/type';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/axiosModule';
import { AxiosError } from 'axios';
function CreateComment({postId}:{postId:number}):ReactElement {
    const user:userType|null = useSelector<reducerType>(state=>state.auth.user) as userType;
  const [openEmogies,setopenEmogies] = useState<boolean>(false);
  const [content,setContent] = useState<string>('');
  const [contentError,setContentError] = useState<string|null>(null);
  const handleCreatePost = useCallback(async(content:string)=>{
        try{
            const url = import.meta.env.VITE_BASU_URL_API+`/comment/createComment?postId=${postId}`;
            const {data}:{data:responseCreatePostApi} = await api.post(url,JSON.stringify({
                content:content
            }),{
                headers:{
                    'Content-Type':'application/json'
                },
                withCredentials:true,
            });
            if(data.status){
                toast.success(`post created successfully`,{
                    position: "bottom-left",
                    autoClose: 500,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                setContent('');
                setContentError(null);
            }
        }catch(e){
            if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                toast.error(`post created failed`,{
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
            setContent('');
            setContentError(null);
        }   
 },[postId]);
  return (
    <>
        <article className='w-full p-2 py-3 flex rounded gap-2'>
            <form onSubmit={(e)=>{
                    e.preventDefault();
                    if(!content||!/^[\W\w]{3,}$/.test(content)){
                        return setContentError('required feild or invalid content');
                    }
                    handleCreatePost(content);
                }} className='w-full relative'>
                    <svg onClick={()=>{
                        setopenEmogies(!openEmogies);
                    }} className='absolute top-3 right-2 text-2xl cursor-pointer z-50' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Face_Smile"><g><path d="M12,21.942A9.942,9.942,0,1,1,21.942,12,9.953,9.953,0,0,1,12,21.942ZM12,3.058A8.942,8.942,0,1,0,20.942,12,8.952,8.952,0,0,0,12,3.058Z"></path><path d="M16.693,13.744a5.041,5.041,0,0,1-9.387,0c-.249-.59-1.111-.081-.863.505a6.026,6.026,0,0,0,11.114,0c.247-.586-.614-1.1-.864-.505Z"></path><circle cx="9" cy="9.011" r="1.25"></circle><circle cx="15" cy="9.011" r="1.25"></circle></g></g></svg>
                    <div className='w-full flex items-center'>
                        <img loading='lazy' className='rounded-full me-2 w-[50px] h-[50px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+user.image} alt={user.name} />
                        <div className='grow relative'>
                            <input type='text' value={content} onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                                const value = e.target.value;
                                setContent(value);
                                if(!/^[\W\w]{3,}$/.test(value)){
                                    setContentError('at least 3 charters');
                                }else{
                                    setContentError(null);
                                }
                            }} className='w-full p-3 rounded-full border-solid border-2 border-slate-400 placeholder:text-lg focus:outline-none' placeholder='What do you want to talk about?'></input>
                            {(contentError)&&<p className='m-0 p-0 my-1 text-red-500'>{contentError}</p>}
                            <div className='absolute top-13 right-0  z-[1000]'>
                                {
                                    (openEmogies)&&<EmojiPicker onEmojiClick={(el)=>{
                                        setContent((content)=>content+el.emoji);
                                        if(!/^[\W\w]{3,}$/.test(content)){
                                            setContentError('at least 3 charters');
                                        }else{
                                            setContentError(null);
                                        }
                                    }} />
                                }
                            </div>
                        </div>
                    </div>
                    <button type='submit' className='mt-2 ms-auto block bg-primary text-white'>Publish</button>
            </form>
        </article>
    </>
  )
}

export default CreateComment;