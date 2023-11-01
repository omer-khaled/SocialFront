import {ReactElement,useState,useEffect,lazy} from 'react'
export const ErrorBoundary = lazy(()=>import('../../utils/ErrorBoundary'));
export const LoadingBoundary = lazy(()=>import('../../utils/LoadingBoundary'));
export const SingleNotification = lazy(()=>import('./SingleNotification'));
import { baseUrl, notificationType, responseNotificationApi, userType } from '../../types/type';
import api from '../../utils/axiosModule';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { reducerType } from '../../store/store';
export default function ShowNotifications():ReactElement {
    const [notifcations,setNotifcations] = useState<notificationType[]|null>(null);
    const [error,setError] = useState<boolean>(false);
    const user = (useSelector<reducerType>(state=>state.auth.user) as userType);
    useEffect(()=>{
        let check = true;
        (async()=>{
            try{
                const url = baseUrl+`/user/getNotifications`;
                const {data}:{data:responseNotificationApi} = await api.get(url,{
                    withCredentials:true,
                });
                if(data.status&&check&&data.notifcations){
                    setNotifcations(data.notifcations);   
                }
            }catch(e){
                setError(true);
            } 
        })()
        const connection = io(baseUrl);
        connection.on(`notifications/${user.id}`,(data:{action:string,notification:notificationType})=>{
            if(data.action==='create'){
                setNotifcations((state)=>{
                    if(state===null){
                        return [data.notification];
                    }else{
                        return [data.notification,...state];
                    }
                });
            }
        });
        return()=>{
            check = false;
        }
    },[user,setNotifcations])
  return (
    <ErrorBoundary error={error}>
        <LoadingBoundary loading={(notifcations)?false:true}>
            {
                (notifcations)?((notifcations.length===0)?<p className='text-white bg-primary text-center p-2 rounded-lg mt-2'>NO Notifications For Now</p>:<>{notifcations.map((el:notificationType)=>{
                    return(
                            <SingleNotification key={(el.type)?`${el.id} type`:`${el.id} comment`} notification={el}/>
                    )
                })}</>):<></>
            }
        </LoadingBoundary>
    </ErrorBoundary>
  )
}
