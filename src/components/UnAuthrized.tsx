import {ReactElement} from 'react'
import authImage from '../assets/3828544.webp';
import { Link } from 'react-router-dom';
function UnAuthrized():ReactElement {
  return (
    <section className='w-full col-start-1 col-end-13 flex justify-center items-center flex-col'>
        <img loading='lazy' className='image-fluid max-h-[80vh]' src={authImage} alt="authImage" />
        <h1 className='text-3xl'>Un Authorized Please login <Link to={'/login'} className='text-primary underline'>Login</Link></h1>
    </section>
  )
}

export default UnAuthrized;