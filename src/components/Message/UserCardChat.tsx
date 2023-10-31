import {ReactElement} from 'react'
import { friendType } from '../../types/type'

export default function UserCardChat({user}:{user:friendType}):ReactElement {
  return (
    <div className='w-full flex items-center justify-start p-2 border-[2px] rounded-lg border-solid border-slate-200'>
        <img className='w-[60px] h-[60px] object-cover rounded-full' src={import.meta.env.VITE_BASU_URL_API+'/images/'+user.image} alt="personalImage" />
        <p className='ms-2 font-bold'>{user.name}</p>
    </div>
  )
}
