import { ReactElement,useEffect} from "react"
import UnAuthrized from "../components/UnAuthrized"
import { useDispatch, useSelector } from 'react-redux';
import { disptachType, reducerType } from '../store/store';
import { refresh,getUserInfo } from '../store/authSlice';
import { userType } from "../types/type";
const protectRoute = (Oldcomponent:()=>ReactElement)=>{
    const NewComponenet = ():ReactElement=>{
        const {auth,user}:{auth:boolean,user:userType} = useSelector<reducerType>(state=>state.auth) as {auth:boolean,user:userType};
        const dispatch = useDispatch<disptachType>();
        useEffect(()=>{
          if(!auth){
            dispatch(refresh()).then(()=>{
              dispatch(getUserInfo());
            });
          }
        },[auth,dispatch]);
        return(
            <>{
                ((auth===true)&&(user!==null))?(<>
                    <Oldcomponent />
                </>):<UnAuthrized/>
            }</>
        )
    }
    return NewComponenet;
}
export default protectRoute;