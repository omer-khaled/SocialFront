import {createSlice,createAsyncThunk} from '@reduxjs/toolkit';
import { authReducerType, baseUrl, errorType, responseLoginApi, responsegetUserInfoApi } from '../types/type';
import axios,{AxiosError} from 'axios';
import api from '../utils/axiosModule';
const refresh = createAsyncThunk('auth/refresh',async(_,{rejectWithValue})=>{
    try{
        const url = baseUrl+'/auth/refreshGetUseInfo';
        const {data}:{data:responsegetUserInfoApi&responseLoginApi} =await api.get(url,{
            withCredentials:true
        });
        return data;
    }catch(e){
        return rejectWithValue((e as AxiosError).response?.data);
    }
});
const signup = createAsyncThunk('auth/signup',async({email,password,name,image}:{email:string,password:string,name:string,image:File},{rejectWithValue})=>{
    try{
        const url = baseUrl+'/auth/signup';
        const formData = new FormData();
        formData.append("email",email);
        formData.append("password",password);
        formData.append("name",name);
        formData.append("image",image);
        const {data}:{data:responseLoginApi} =await axios.post(url,formData,{
            withCredentials:true,
        });
        return data;
    }catch(e){
        return rejectWithValue((e as AxiosError).response?.data);
    }
});
const initialState:authReducerType = {
    auth:null,
    user:null,
    errors:null,
    signupErrors:null,
    notifications:0,
    messages:[],
}
const authSlice =  createSlice({
    name:'auth',
    initialState,
    reducers:{
        refresh:(state)=>{
            state.auth=true;
        },
        addNotification:(state)=>{
            if(state.user){
                state.notifications += 1;
            }
        },
        removeNotification:(state)=>{
            if(state.user){
                state.notifications -= 1;
            }
        },
        addMessages:(state,action)=>{
            if(state.user){
                state.messages=[{senderId:action.payload},...(state.messages)];
            }
        },
        removeMessages:(state,action)=>{
            if(state.user){
                state.messages=state.messages.filter((el:{senderId:number})=>{
                    return el.senderId.toString()!==action.payload.toString();
                });
            }
        },
        makeAuthTrue:(state)=>{
            state.auth=true;
        },
        makeAuthFalse:(state)=>{
            state.auth=false;
        },
    },
    extraReducers:(builder)=>{
        // ---------------refresh--------------
        builder.addCase(refresh.rejected,(state)=>{
            if(state.auth){
                state.auth = false;
                state.errors = null;
                state.user=null;
            }
        });
        builder.addCase(refresh.fulfilled,(state,action)=>{
            state.auth=true;
            state.user = null;
            state.errors=null;
            if(action.payload.accessToken){
                api.defaults.headers.common['Authorization'] = "Bearer "+action.payload.accessToken;
            }
            if(action.payload.user&&action.payload.status){
                state.user = action.payload.user;
                state.notifications=action.payload.user.notifications
                state.messages=action.payload.user.messages
            }
        });
        // ------------------SignUp------------------
        builder.addCase(signup.pending,(state)=>{
            state.auth=null;
            state.user=null;
            state.signupErrors=null;
        });
        builder.addCase(signup.rejected,(state,action)=>{
            const payload = (action.payload as {status:boolean,error:errorType[]});
            if(payload.error){
                state.signupErrors = payload.error;
            }
            state.auth = false;
            state.user=null;
        });
    }
});
const {reducer:authReducer,actions:{addNotification,removeNotification,addMessages,removeMessages,makeAuthTrue,makeAuthFalse}} = authSlice;

export {authReducer,refresh,signup,addNotification,removeNotification,addMessages,removeMessages,makeAuthTrue,makeAuthFalse};
