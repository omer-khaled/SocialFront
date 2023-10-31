import {ReactElement,useState,useEffect,lazy} from 'react'
import { useParams } from 'react-router-dom';
import { baseResponseType, baseUrl, postType } from '../../types/type';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const PostCard = lazy(()=>import('./PostCard'));
export const UserCard = lazy(()=>import('./UserCard'));
import api from '../../utils/axiosModule';

function SinglePost():ReactElement {
  const {id} = useParams();
  const [post,setPost] = useState<postType|null>(null);
  const [error,serError] = useState<boolean>(false);
  useEffect(()=>{
    let check = true;
    (async()=>{
        try{
            const url = baseUrl+`/post/getSinglePost/${id}`;
            const {data}:{data:baseResponseType&{post:postType}} = await api.get(url,{
                withCredentials:true,
            });
            if(data.status&&check&&data.post){
                setPost(data.post);
            }else{
                serError(true);
            }
        }catch(e){
            serError(true);
        }
    })()
    return()=>{
        check = false;
    }
},[id,setPost,serError]);
  return (
    <LoadingBoundary loading={(!post)?true:false}>
        <ErrorBoundary error={error}>
            <>
                <section className='col-start-1 col-end-4'>
                    <UserCard/>    
                </section>    
                <section className='col-start-4 col-end-10'>
                    {post?<PostCard post={post} showAll={true} />:<></>}      
                </section>    
            </>
        </ErrorBoundary>
    </LoadingBoundary>
  )
}
export default SinglePost;