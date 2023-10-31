import {ReactElement} from 'react'
import Loading from '../components/Loading';
type propsType = {
    children:ReactElement|Element|Element[],
    loading:boolean,
}
function LoadingBoundary({children,loading}:propsType):ReactElement {
  return (
    (loading)?<Loading/>:children as ReactElement
  )
}

export default LoadingBoundary;