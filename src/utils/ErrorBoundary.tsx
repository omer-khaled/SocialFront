import {ReactElement} from 'react'
import ServerError from '../components/ServerError';
type propsType = {
    children:ReactElement,
    error:boolean,
}
function ErrorBoundary({children,error}:propsType):ReactElement {
  return (
    (error)?<ServerError/>:children as ReactElement
  )
}

export default ErrorBoundary;