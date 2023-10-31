import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { baseUrl, friendReducerType, friendType, responseFriendsApi } from '../types/type';
import {AxiosError} from 'axios';
import api from '../utils/axiosModule';
const getFriends = createAsyncThunk('friends/getFriends',async(_,{rejectWithValue})=>{
    try{
        const url = baseUrl+'/user/getFriends';
        const {data}:{data:responseFriendsApi} =await api.get(url,{
            withCredentials:true,
        });
        return data;
    }catch(e){
        return rejectWithValue((e as AxiosError).response?.data);
    }
})
const initialState:friendReducerType = {
    friends:null,
    error:false,
    loading:false,
};
const friendSlice = createSlice({
    initialState,
    name:'friends',
    reducers:{
        addFriend:(state,action)=>{
            if(state.friends){
                state.friends = [action.payload,...(state.friends)]
            }else{
                state.friends = [action.payload]
            }
        },
        removeFriend:(state,action)=>{
            if(state.friends){
                state.friends = state.friends.filter((el:friendType)=>{
                    return el.friendId!==action.payload;
                })
            }
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getFriends.fulfilled,(state,action)=>{
            state.error = false;
            state.loading=false;
            state.friends=(action.payload.friends as friendType[]);
        });
        builder.addCase(getFriends.pending,(state)=>{
            state.friends = null;
            state.error = false;
            state.loading=true;
        });
        builder.addCase(getFriends.rejected,(state)=>{
            state.friends = null;
            state.error = true;
            state.loading=false;
        });
    }
});

const {reducer:friendsReducer,actions:{addFriend,removeFriend}} = friendSlice;

export {friendsReducer,getFriends,addFriend,removeFriend};