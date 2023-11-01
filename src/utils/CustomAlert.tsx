import {ReactElement, useState, useEffect, Dispatch, SetStateAction} from 'react'
import iconInfo from '../assets/iconInfo.webp';
export default function CustomAlert({callBackFn,setOpenAlert,friendId}:{friendId:number,callBackFn:(friendId:number)=>void,setOpenAlert:Dispatch<SetStateAction<boolean>>}):ReactElement {
  const [checked,setChecked] = useState(false);
  useEffect(()=>{
    if(checked){
        callBackFn(friendId);
    }
  },[checked,callBackFn,friendId])
  return (
    <section className='w-full flex flex-col justify-start items-center z-[50]  bg-[#0000004e] inset-0 fixed'>
        <article className='bg-white flex flex-col p-5 rounded-md absolute top-[50%] left-[50%] -translate-y-[50%] -translate-x-[50%] max-h-[40vh] overflow-auto min-w-[30vw] '>
            <img src={iconInfo} alt='iconInfo' className='w-[80px] h-[80px] mx-auto mb-4 rounded-full' />
            <p className='text-xl text-black mb-4 text-center'>Are You Sure?</p>
            <p className='text-xl text-black mb-4 text-center'>You won't be able to revert this!</p>
            <div className='flex justify-center items-center'>
                <button className='b-2 bg-primary text-white me-4' onClick={()=>{
                    setChecked(true);
                }}>Yes, delete it!</button>
                <button onClick={()=>{
                    setOpenAlert(false);
                    document.body.classList.remove('no-scroll');
                }} className='b-2 bg-red-500 text-white'>Cancel</button>
            </div>
        </article>
    </section>  
  )
}
