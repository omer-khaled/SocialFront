import {ReactElement} from 'react'
import serverImage from '../assets/500-internal-server-error-concept-illustration_114360-1885.webp';
function ServerError():ReactElement {
  return (
    <section className='flex justify-center items-center flex-col'>
        <img loading='lazy' className='image-fluid max-h-[80vh]' src={serverImage} alt="serverImage" />
        <h1 className='text-3xl font-bold text-red-600'>Server Error 500</h1>
    </section>
  )
}

export default ServerError;
