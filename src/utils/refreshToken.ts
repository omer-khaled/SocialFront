import axios from "axios";
import { baseUrl, responseLoginApi } from "../types/type";
import api from "./axiosModule";

const refreshToken = async()=>{
    const url = baseUrl+'/auth/refresh';
    const {data}:{data:responseLoginApi} =await axios.get(url,{
        withCredentials:true
    });
    return data;
}

const addTokenToAxios = async()=>{
    const data:responseLoginApi = await refreshToken();
    if(data.accessToken){
        api.defaults.headers.common['Authorization'] = "Bearer "+data.accessToken;
    }
}

export {refreshToken,addTokenToAxios};