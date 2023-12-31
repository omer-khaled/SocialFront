import {ReactElement,lazy} from 'react'
import protectRoute from '../utils/protectRoute';
export const Chats = lazy(()=>import('../components/Message/Chats'));

function Message():ReactElement {
  return (
    <section className='col-start-1 col-end-13 max-h-[85vh] grid grid-cols-12'>
        <Chats />
    </section>
  )
}
export default protectRoute(Message) as (typeof Message);