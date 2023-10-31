import {ReactElement,useState,createContext,lazy} from 'react'
export const Login = lazy(()=>import('../components/Home/Login'));
export const SignUp = lazy(()=>import('../components/Home/SignUp'));
import { Link } from 'react-router-dom';
export const contextOpen = createContext<React.Dispatch<React.SetStateAction<boolean>>|undefined>(undefined);
function Home():ReactElement{
  const [openSignup,setOpenSignup] = useState<boolean>(false);

  return (
    <contextOpen.Provider value={setOpenSignup}>
        <section className='mx-auto relative p-10 w-full flex justify-between items-center container max-lg:flex-col min-h-screen max-lg:justify-start max-lg:p-2'>
            <article className='box-border w-2/4 box p-3 max-lg:w-full'>
                <h1 className='p-0 m-0 mb-4 text-primary text-6xl font-bold max-lg:text-center'>Media</h1>
                <p className='w-3/4 m-0 p-0 ps-3 text-3xl font-[400] max-lg:text-xl max-lg:ps-0 max-md:w-full max-lg:mx-auto max-lg:text-center'>Connect with friends and the world around you on OmerMedia</p>
            </article>
            <article className='w-2/4 flex justify-end flex-col max-lg:w-full max-lg:mt-5'>
              <Login />
              <div className='w-3/4 box-border px-4 rounded-b-md bg-white max-lg:mx-auto'>
                  <Link to={'/resetPassword'} className='block underline text-center my-3'>Forgot password?</Link>
                  <hr className='border-slate-500' />
                  <button onClick={()=>{
                    setOpenSignup(true);
                  }} className='p-2 text-lg text-white bg-green-500 mt-4 mb-3 mx-auto block focus:outline-none'>Create new account</button>
              </div>
            </article>
        </section>
        {openSignup&&<div className='inset-0 absolute bg-[#e9e9e996] flex justify-center items-center'><SignUp/></div>}
    </contextOpen.Provider>
  )
}

export default Home;