import {ReactElement,lazy} from 'react'
import protectRoute from '../utils/protectRoute';
export const ShowNotifications = lazy(()=>import('../components/Notifications/ShowNotifications'));
function Notification():ReactElement {
  return (
    <>
        <section className='col-start-4 col-end-10 flex flex-col'>
            <ShowNotifications />
        </section>
    </>
  )
}
export default protectRoute(Notification) as (typeof Notification);