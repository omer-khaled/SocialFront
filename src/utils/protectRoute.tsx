import { ReactElement } from "react"
import { useSelector } from "react-redux"
import { reducerType } from "../store/store"
import UnAuthrized from "../components/UnAuthrized"

const protectRoute = (Oldcomponent:()=>ReactElement)=>{
    const NewComponenet = ():ReactElement=>{
        const auth = useSelector<reducerType>(state=>state.auth.auth);
        return(
            <>{
                (auth)?<Oldcomponent />:<UnAuthrized/>
            }</>
        )
    }
    return NewComponenet;
}
export default protectRoute;