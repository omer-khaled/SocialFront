import {ReactElement} from 'react'
import ReactLoading from 'react-loading';
function Loading():ReactElement{
  return (
    <div className='w-full flex justify-center items-center'>
      <ReactLoading color='#1877f2' type='bars' width={"250px"} height={"250px"}/>
    </div>
  )
}

export default Loading;