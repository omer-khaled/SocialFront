import {ReactElement,useEffect,useState,lazy,Suspense} from 'react'
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const PostCard = lazy(()=>import('../SocialHome/PostCard'));
import { baseResponseType, baseUrl, postType } from '../../types/type';
import api from '../../utils/axiosModule';
import { io } from 'socket.io-client';
import Loading from '../Loading';

function ProfilePosts({id}:{id:string}):ReactElement {
    const [posts,setPosts] = useState<postType[]|null>(null);
    const [error,setError] = useState<boolean>(false);
    useEffect(()=>{
        let check = true;
        (async()=>{
            try{
                const url = baseUrl+`/user/getProfilePosts/${id}`;
                const {data}:{data:baseResponseType&{posts:postType[]}} = await api.get(url,{
                    withCredentials:true,
                });
                if(data.status&&check){
                    setPosts(data.posts);
                }else{
                    setError(true);
                }
            }catch(e){
                setError(true);
            }
        })()
        return()=>{
            check = false;
        }
    },[id]);
    useEffect(()=>{
        const connection = io('http://localhost:3002');
        connection.on(`posts/${id}`,(data:{post:postType|number,action:string})=>{
          if(data.action==='create'){
                setPosts((state)=>{
                    if(state){
                        state = [(data.post as postType),...(state)]
                    }else{
                        state = [(data.post as postType)]
                    }
                    return [...state];
                })
          }
          else if(data.action==='delete'){
            setPosts((state)=>{
                if(state){
                    return state.filter((el:postType)=>{
                        return el.id.toString()!==(data.post as number).toString();
                    });
                }
                return state;
            })
          }
          else if(data.action==='update'){
            setPosts((state)=>{
                if(state){
                    const foundedPostIndex = state.findIndex((el:postType)=>{
                        return el.id.toString()===(data.post as postType).id.toString();
                    });
                    if(foundedPostIndex!==-1){
                        state[foundedPostIndex] = (data.post as postType);
                    }
                    return [...state];
                }
                return state;
            })
          }
        });
        return()=>{
          if(connection){
            connection.close();
          }
        }
      },[id]);
  return (
    <ErrorBoundary error={error}>
        <LoadingBoundary loading={(posts)?false:true}>
            <>
                {(posts)?((posts.length>0)?<>{posts.map((el:postType)=>{
                    return (
                        <Suspense fallback={<Loading />}>    
                            <PostCard post={el} showAll={null} key={el.id}/>
                        </Suspense>
                    )
                })}</>:<p className='w-full p-2 rounded bg-primary text-white text-center'>No Posts For Now</p>):<></>}
            </>
        </LoadingBoundary>
    </ErrorBoundary>
  )
}
export default ProfilePosts;