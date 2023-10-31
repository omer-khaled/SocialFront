import {configureStore} from '@reduxjs/toolkit';
import { postsReducer } from './postsSlice';
import { authReducer } from './authSlice';
import { friendsReducer } from './friendsSlice';
const store = configureStore({
    reducer:{
        auth:authReducer,
        posts:postsReducer,
        friends:friendsReducer
    }
});


const reducer = store.getState();
export type disptachType = typeof store.dispatch;
export type reducerType = typeof reducer;
export {store};
