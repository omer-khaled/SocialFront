import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { baseUrl, postType, postsReducerType, responsePostsApi } from '../types/type';
import {AxiosError} from 'axios';
import api from '../utils/axiosModule';
const getPosts = createAsyncThunk('posts/getPosts',async({page,socketIds}:{page:number,socketIds:number[]},{rejectWithValue})=>{
    try{
        const url = baseUrl+`/post/getPosts?page=${page}&sokcet=${socketIds.length}`;
        const {data}:{data:responsePostsApi} =await api.get(url,{
            withCredentials:true,
        });
        return {...data,page:page};
    }catch(e){
        return rejectWithValue((e as AxiosError).response?.data);
    }
})
const initialState:postsReducerType = {
    posts:null,
    error:false,
    totalPages:null,
    loading:false,
};
const postsSlice = createSlice({
    initialState,
    name:'posts',
    reducers:{
        addPost:(state,action)=>{
            if(state.posts){
                state.posts = [action.payload,...(state.posts)]
            }else{
                state.posts = [action.payload]
            }
        },
        deletePost:(state,action)=>{
            if(state.posts){
                state.posts = state.posts.filter((el:postType)=>{
                    return el.id.toString()!==action.payload.toString();
                })
            }
        },
        addDeletedPost:(state,action)=>{
            if(state.posts){
                state.posts = [...(state.posts),action.payload]
            }else{
                state.posts = [action.payload]
            }
        },
        updatePost:(state,action)=>{
            if(state.posts){
                const foundedPostIndex = state.posts.findIndex((el:postType)=>{
                    return el.id===action.payload.id;
                });
                if(foundedPostIndex!==-1){
                    state.posts[foundedPostIndex] = action.payload;
                }
            }
        },
        resetPosts:(state)=>{
            state.posts=null;
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getPosts.fulfilled,(state,action)=>{
            if(action.payload.page===1){
                state.posts=[...(action.payload.posts as postType[])];
            }else{
                if(state.posts){
                    state.posts=[...(state.posts),...(action.payload.posts as postType[])];
                }else{
                    state.posts=[...(action.payload.posts as postType[])];
                }
            }
            state.error = false;
            state.loading=false;
            state.totalPages=(action.payload.totalPages as number);
        });
        builder.addCase(getPosts.rejected,(state)=>{
            state.posts = null;
            state.totalPages = null;
            state.error = true;
            state.loading=false;
        });
    }
});

const {reducer:postsReducer,actions:{addPost,deletePost,addDeletedPost,updatePost,resetPosts}} = postsSlice;

export {postsReducer,getPosts,addPost,deletePost,addDeletedPost,updatePost,resetPosts};