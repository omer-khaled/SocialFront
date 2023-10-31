import {ReactElement} from 'react'
import authImage from '../assets/3828544.jpg';
import { Link } from 'react-router-dom';
function UnAuthrized():ReactElement {
  return (
    <section className='flex justify-center items-center flex-col'>
        <img className='image-fluid max-h-[80vh]' src={authImage} alt="authImage" />
        <h1 className='text-3xl'>Un Authorized Please login <Link to={'/'} className='text-primary underline'>Login</Link></h1>
    </section>
  )
}

export default UnAuthrized;