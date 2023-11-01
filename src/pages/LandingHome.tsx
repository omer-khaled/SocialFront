import {ReactElement,lazy} from 'react'
import protectRoute from '../utils/protectRoute';
export const Posts = lazy(()=>import('../components/SocialHome/Posts'));
export const CreatePost = lazy(()=>import('../components/SocialHome/CreatePost'));
export const UserCard = lazy(()=>import('../components/SocialHome/UserCard'));
export const FreindesRequests = lazy(()=>import('../components/SocialHome/FreindesRequests'));

function LandingHome():ReactElement {
  return (
    <>
        <section className='col-start-1 col-end-4 flex flex-col justify-start items-start'>
            <UserCard/>
        </section>
        <section className='col-start-4 col-end-10 flex flex-col'>
            <CreatePost/>
            <Posts />
        </section>
        <section className='col-start-10 col-end-13 flex flex-col justify-start items-start'>
            <FreindesRequests/>
        </section>
    </>
  )
}
export default protectRoute(LandingHome) as (typeof LandingHome);