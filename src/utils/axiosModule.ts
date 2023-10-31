import axios from 'axios';
import { addTokenToAxios } from './refreshToken';
// Create an Axios instance with your base URL
const api = axios.create();

api.interceptors.response.use(async (response) => {
    return response;
  }, async(error) => {
    if(error.response.data.status===false&&(error.response.config.url!=='http://localhost:3002/user/refresh')){
      if(error.response.data.error==='jwt expired'){
        try{
            await addTokenToAxios();
            error.config.headers.Authorization="Bearer"+api.defaults.headers.common['Authorization'];
            await api(error.config);
        }catch(e){
          console.log(e);
        }
      }
    }
    return Promise.reject(error);
})

// Export the Axios instance
export default api;