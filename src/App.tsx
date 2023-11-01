import {ReactElement,lazy} from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
export const Navbar = lazy(()=>import('./components/Navbar'));
function App() :ReactElement{
  return (
      <main className='box-border  relative w-full flex justify-start items-center min-h-screen flex-col'>
        <Navbar/>
        <section className='w-full container lg:w-[1000px] xl:w-[1256px] 2xl:w-[1400px] p-2 grow grid grid-cols-12 gap-4'>
          <Outlet/>
        </section>
        <ToastContainer 
          position="bottom-left"
          autoClose={500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          />
      </main>
  )
}

export default App
