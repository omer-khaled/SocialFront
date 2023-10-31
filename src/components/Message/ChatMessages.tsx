import {ReactElement, useState,ChangeEvent,useCallback, useRef, useEffect} from 'react'
import { messageType, responseCreatePostApi } from '../../types/type';
import EmojiPicker from 'emoji-picker-react';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import api from '../../utils/axiosModule';
import 'react-toastify/dist/ReactToastify.css';
function ChatMessages({chat,friendId,myId}:{chat:messageType[],friendId:string,myId:string}):ReactElement {
    let prevDate = '';
    const [openEmogies,setopenEmogies] = useState<boolean>(false);
    const [content,setContent] = useState<string>('');
    const [file,setFile] = useState<File|null>(null);
    // const [imageError,setImageError] = useState<string|null>(null);
    const lastRef = useRef<HTMLDivElement>(null)
    // const [image,setImage] = useState<string|null>(null);
    const [contentError,setContentError] = useState<string|null>(null);
    const handleCreatePost = useCallback(async(content:string,file:File)=>{
        try{
            const url = import.meta.env.VITE_BASU_URL_API+`/messages/createMessage/${friendId}`;
            const formData = new FormData();
            formData.append('content',content);
            formData.append('image',file);
            const {data}:{data:responseCreatePostApi} = await api.post(url,formData,{
                withCredentials:true,
            });
            if(data.status){
                toast.success(`message send successfully`,{
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
                // setImage(null);
                setFile(null);
                // setImageError(null);
            }
        }catch(e){
            if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                toast.error(`${"message send failed"}`,{
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
            setFile(null);
            // setImageError(null);
        }   
    },[friendId]);
    useEffect(()=>{
        if(lastRef.current){
            lastRef.current.scrollIntoView();
        }
    },[chat.length])
  return (
    <>
        <section className='w-full grow overflow-auto flex p-2 flex-col'>
            {(chat.length===0)?<article className='w-full grow flex justify-center items-center'>
                <p className='text-center font-bold tracking-wide text-black bg-slate-300 rounded p-2'>chat with any on to make messages</p>
            </article>:<>
                {
                    (chat).map((el:messageType)=>{
                        let check = false;
                        if((new Date(el.createdAt).toLocaleDateString())!==prevDate){
                            check = true;
                            prevDate = (new Date(el.createdAt).toLocaleDateString());
                        }
                        const checking = el.senderId.toString()===myId.toString();
                        return(
                            <article key={el.id}>
                                {(check)&&<p className='bg-primary p-1 rounded text-white w-fit mx-auto'>{prevDate}</p>}
                                <div  className={`flex w-full h-fit px-3 py-2`}>
                                    <div className={`${checking?"bg-[#d5f0bf] ms-auto":"bg-white"} rounded-lg shadow-md p-2 min-w-[30%] max-w-[80%] relative`}>
                                        <p>{el.content}</p>
                                        <div className='flex items-center m-1'>
                                            <p className='bg-slate-200 rounded p-1 ms-auto'>{new Date(el.createdAt).toLocaleTimeString()}</p>
                                        </div>
                                        <div className={`absolute top-0 ${(checking)?"-right-4 left-path":"-left-4 right-path"}`}></div>
                                    </div>
                                </div>
                            </article>
                        )
                    })
                }
            </>}
            <div ref={lastRef}></div>
        </section>
        <footer className='w-full p-2'>
                <form className='flex' onSubmit={(e)=>{
                     e.preventDefault();
                     if(contentError){
                         return setContentError('required feild or invalid content');
                     }
                     handleCreatePost(content,(file as File));
                }}>
                    <div className='grow relative flex items-center'>
                        <svg onClick={()=>{
                            setopenEmogies(!openEmogies);
                        }} className='text-2xl cursor-pointer leading-none me-2' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Face_Smile"><g><path d="M12,21.942A9.942,9.942,0,1,1,21.942,12,9.953,9.953,0,0,1,12,21.942ZM12,3.058A8.942,8.942,0,1,0,20.942,12,8.952,8.952,0,0,0,12,3.058Z"></path><path d="M16.693,13.744a5.041,5.041,0,0,1-9.387,0c-.249-.59-1.111-.081-.863.505a6.026,6.026,0,0,0,11.114,0c.247-.586-.614-1.1-.864-.505Z"></path><circle cx="9" cy="9.011" r="1.25"></circle><circle cx="15" cy="9.011" r="1.25"></circle></g></g></svg>
                        <input type="text" value={content} onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                            const value = e.target.value;
                            setContent(value);
                            if(!/^[\W\w]{1,}$/.test(value)){
                                setContentError('at least 1 charters');
                            }else{
                                setContentError(null);
                            }
                    }} placeholder='Type a message' className='placeholder:text-md form-control w-full' />
                        <div className='absolute bottom-12 left-1'>
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
                        <button type='submit' className='absolute top-[50%] -translate-y-[50%] leading-none right-2 text-2xl cursor-pointer p-0 m-0 hover:border-none hover:outline-none focus:outline-none focus:border-none'>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"></path></svg>
                        </button>
                    </div>
                </form>
        </footer>
    </>
  )
}
export default ChatMessages;