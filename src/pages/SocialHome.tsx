import {ReactElement,lazy} from 'react'
import protectRoute from '../utils/protectRoute';
import { Outlet } from 'react-router-dom';
export const Navbar = lazy(()=>import('../components/Navbar'));


export function SocialHome():ReactElement{
  return (
    <>
      <Navbar/>
      <section className='w-full container lg:w-[1000px] xl:w-[1256px] 2xl:w-[1400px] p-2 grow grid grid-cols-12 gap-4'>
        <Outlet/>
      </section>
    </>
  )
}

export default protectRoute(SocialHome) as (typeof SocialHome);