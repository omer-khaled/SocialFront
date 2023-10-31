import {ChangeEvent,useCallback, ReactElement,useState,useEffect,lazy, SetStateAction, Dispatch} from 'react'
import { baseResponseType, baseUrl, responseCreatePostApi, userType } from '../../types/type';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
import EmojiPicker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/axiosModule';
import { AxiosError } from 'axios';
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
function UpdatePost({id,setOpenCreatePost}:{id:number,setOpenCreatePost:Dispatch<SetStateAction<boolean>>}):ReactElement {
  const user:userType|null = useSelector<reducerType>(state=>state.auth.user) as userType;
  const [openEmogies,setopenEmogies] = useState<boolean>(false);
  const [content,setContent] = useState<string>('');
  const [file,setFile] = useState<File|null>(null);
  const [imageError,setImageError] = useState<string|null>(null);
  const [image,setImage] = useState<string|null>(null);
  const [contentError,setContentError] = useState<string|null>(null);
  const [post,setPost] = useState<{content:string,postImage:string|null,id:number}|null>(null);
  const handleUpdatePost = useCallback(async(content:string,file:File)=>{
        try{
            const url = import.meta.env.VITE_BASU_URL_API+`/post/updatePost/${id}`;
            const formData = new FormData();
            formData.append('content',content);
            formData.append('image',file);
            const {data}:{data:responseCreatePostApi} = await api.put(url,formData,{
                withCredentials:true,
            });
            if(data.status){
                document.body.classList.remove('no-scroll');
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
                setOpenCreatePost(false);
                setContent('');
                setContentError(null);
                setImage(null);
                setFile(null);
                setImageError(null);
            }
        }catch(e){
            if((((e as AxiosError)?.response?.data) as {error:string|[],status:boolean})?.error!=="jwt expired"){
                toast.error(`${"post created failed"}`,{
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
            setOpenCreatePost(false);
            setContent('');
            setContentError(null);
            setImage(null);
            setFile(null);
            setImageError(null);
        }   
    },[id,setOpenCreatePost]);
  useEffect(()=>{
    let check = true;
    (async()=>{
        try{
            const url = baseUrl+`/post/getSinglePost/${id}`;
            const {data}:{data:baseResponseType&{post:{content:string,postImage:string|null,id:number}}} = await api.get(url,{
                withCredentials:true,
            });
            if(data.status&&check&&data.post){
                setPost(data.post);
                setContent(data.post.content);
                if(data.post.postImage){
                    setImage(import.meta.env.VITE_BASU_URL_API+'/images/'+data.post.postImage);
                }
            }
        }catch(e){
                toast.error(`${"post created failed"}`,{
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
    })()
    return ()=>{
        check = false;
    }
 },[id])
  return (
    <>
        <article className='flex flex-col max-h-[100vh] overflow-auto p-5 justify-start items-center absolute inset-0 bg-[#0000004e] z-50'>
            <LoadingBoundary loading={(post)?false:true}>
                {(post)?<div className='bg-white  mt-[100px] p-4 w-2/4 rounded-md relative'>
                    <div className='flex justify-start items-start'>
                        <img className='rounded-full w-[70px] h-[70px] object-cover' src={import.meta.env.VITE_BASU_URL_API+'/images/'+user.image} alt={user.name} />
                        <span className='my-auto ms-1'>{user.name}</span>
                    </div>
                    <form onSubmit={(e)=>{
                        e.preventDefault();
                        if(!content||!/^[\W\w]{3,}$/.test(content)){
                            return setContentError('required feild or invalid content');
                        }
                        handleUpdatePost(content,(file as File));
                    }} className='w-full  relative'>
                        <svg onClick={()=>{
                            setopenEmogies(!openEmogies);
                        }} className='absolute top-7 right-2 text-2xl cursor-pointer' stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g id="Face_Smile"><g><path d="M12,21.942A9.942,9.942,0,1,1,21.942,12,9.953,9.953,0,0,1,12,21.942ZM12,3.058A8.942,8.942,0,1,0,20.942,12,8.952,8.952,0,0,0,12,3.058Z"></path><path d="M16.693,13.744a5.041,5.041,0,0,1-9.387,0c-.249-.59-1.111-.081-.863.505a6.026,6.026,0,0,0,11.114,0c.247-.586-.614-1.1-.864-.505Z"></path><circle cx="9" cy="9.011" r="1.25"></circle><circle cx="15" cy="9.011" r="1.25"></circle></g></g></svg>
                        <textarea value={content} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=>{
                            const value = e.target.value;
                            setContent(value);
                            if(!/^[\W\w]{3,}$/.test(value)){
                                setContentError('at least 3 charters');
                            }else{
                                setContentError(null);
                            }
                        }} className='w-full mt-3 ps-3 pt-3 placeholder:text-xl focus:outline-none' rows={12} placeholder='What do you want to talk about?'></textarea>
                        {(contentError)&&<p className='m-0 p-0 my-1 text-red-500'>{contentError}</p>}
                        <div className='w-full my-3 max-lg:my-5'>
                            <input className={`form-control border-primary`} type="file" name="file" onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                                if( e.target.files){
                                    const file = e.target.files[0];
                                    const allowedTypes = ['image/jpeg','image/jpg','image/png'];
                                    if(file){
                                        if(!allowedTypes.includes(file.type)){
                                            setFile(null);
                                            setImage(null);
                                            setImageError('should be .png .jpg .jpeg')
                                        }
                                        else{
                                            setImageError(null);
                                            setImage(URL.createObjectURL(file));
                                            setFile(file);
                                        }
                                    }else{
                                        setFile(null);
                                        setImage(null);
                                        setImageError(null);
                                    }
                                }
                            }}/>
                            {(imageError)&&<p className='m-0 p-0 text-red-500'>{imageError}</p>}
                        </div>
                        {(image&&!imageError)&&<img src={image} className='mx-auto image-fluid object-contain m-0 p-0 max-h-[50vh]' alt='personal image'/>}                   
                        <button type='submit' className='mt-2 ms-auto block bg-primary text-white'>Publish</button>
                        <div className='absolute top-16 right-0'>
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
                    </form>
                    <svg onClick={()=>{
                        setOpenCreatePost(false);
                        setContent('');
                        setContentError(null);
                        setImage(null);
                        setFile(null);
                        setImageError(null);
                        document.body.classList.remove('no-scroll');
                    }} className="text-lg cursor-pointer text-red-600 absolute top-4 right-4" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" fill-rule="evenodd" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"></path></svg>
                </div>:<></>}
            </LoadingBoundary>
        </article>
    </>
  )
}

export default UpdatePost;