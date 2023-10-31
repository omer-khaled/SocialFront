import { ReactElement,lazy } from 'react'
import { useParams } from 'react-router-dom'
export const UserProfileCard = lazy(()=>import('../profile/UserProfileCard'));
export const Freindes = lazy(()=>import('./Freindes'));
export const ProfilePosts = lazy(()=>import('../profile/ProfilePosts'));

export default function UserProfile():ReactElement {
    const {id} = useParams();
  return (
      <>
        <section className='col-start-1 col-end-4 flex flex-col justify-start items-start'>
            {(id)&&<UserProfileCard id={id}/>}
        </section>
        <section className='col-start-4 col-end-10 flex flex-col'>
            {(id)&&<ProfilePosts id={id}/>}
        </section>
        <section className='col-start-10 col-end-13'>
            {(id)&&<Freindes id={id}/>}
        </section>
    </>
  )
}
