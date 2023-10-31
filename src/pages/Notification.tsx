import {ReactElement,lazy} from 'react'
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
export default Notification;