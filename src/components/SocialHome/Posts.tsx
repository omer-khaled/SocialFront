import {ReactElement, useEffect ,useRef,useState, useCallback,lazy} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { disptachType, reducerType } from '../../store/store';
import { addDeletedPost, addPost, deletePost, getPosts, resetPosts, updatePost } from '../../store/postsSlice';
import { baseUrl, postType, postsReducerType, responsePostsApi } from '../../types/type';
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const PostCard = lazy(()=>import('./PostCard'));
import {io} from 'socket.io-client';
import api from '../../utils/axiosModule';
function Posts():ReactElement {
  const dispatch = useDispatch<disptachType>();
  const {posts,error,totalPages}:postsReducerType = (useSelector<reducerType>(state=>state.posts) as postsReducerType);
  const [page,setPage] = useState<number>(1);
  const lastRef = useRef<HTMLDivElement>(null);
  const [socketIds,setSocketIds] = useState<number[]>([]);
  const handleScroll = useCallback(()=>{
    if(lastRef.current){
      const topfarDiv = lastRef.current?.getBoundingClientRect().top;
      if(topfarDiv<=window.innerHeight){
          setPage((page)=>{
            return page+1;
          });
      }
    }
  },[]);
  useEffect(()=>{
    let check = true;
      if(check){
        if(page===1){
          dispatch(resetPosts());
        }
        dispatch(getPosts({page,socketIds}));
      }
    return()=>{
      check = false;
    }
  },[dispatch,page]);
  useEffect(()=>{
    if(page===totalPages){
      window.removeEventListener('scroll',handleScroll);
   }
  },[page,totalPages,handleScroll])
  useEffect(()=>{
    const connection = io('http://localhost:3002');
    connection.on('posts',(data:{post:postType,action:string})=>{
      if(data.action==='create'){
        setSocketIds(state=>{
          state.push(data.post.id);
          return state;
        })
        dispatch(addPost(data.post));
      }
      else if(data.action==='delete'){
        dispatch(deletePost(data.post));
        if(totalPages){
          if(totalPages>page){
            (async()=>{
              try{
                const url = baseUrl+`/post/getExtraPosts?page=${page+1}&sokcet=${socketIds.length}`;
                const {data}:{data:responsePostsApi} =await api.get(url,{
                    withCredentials:true,
                });
                if(data.posts){
                  dispatch(addDeletedPost(data.posts[0]));
                  // setSocketIds(state=>{
                  //   if(data.posts){
                  //     state.push(data.posts[0].id);
                  //     return state;
                  //   }
                  //   return state;
                  // })
                }
              }catch(e){
                  console.log(e);
              }
            })()
          }
        }
      }
      else if(data.action==='update'){
        dispatch(updatePost(data.post));
      }
    });
    return()=>{
      if(connection){
        connection.close();
      }
    }
  },[dispatch,totalPages,page,socketIds.length]);
  useEffect(() => {
    window.addEventListener('scroll',handleScroll);
    return () => {
      window.removeEventListener('scroll',handleScroll);
    }
  }, [handleScroll]);
  return (
    <ErrorBoundary error={error}>
      <LoadingBoundary loading={(posts===null)?true:false}>
        <>
          {(posts)?((posts.length>0)?<>{posts.map((el:postType)=>{
            return (
              <PostCard showAll={null} post={el} key={el.id}/>
            )
          })}</>:<></>):<></>}
          <div ref={lastRef}></div>
        </>
      </LoadingBoundary>
    </ErrorBoundary>
  )
}
export default Posts;