import { ReactElement } from "react"
import { useSelector } from "react-redux"
import { reducerType } from "../store/store"
import UnAuthrized from "../components/UnAuthrized"
import { Loading } from "../main"

const protectRoute = (Oldcomponent:()=>ReactElement)=>{
    const NewComponenet = ():ReactElement=>{
        const auth = useSelector<reducerType>(state=>state.auth.auth);
        const user = useSelector<reducerType>(state=>state.auth.user);
        return(
            <>{
                (auth)?((user)?<Oldcomponent />:<Loading/>):<UnAuthrized/>
            }</>
        )
    }
    return NewComponenet;
}
export default protectRoute;