import {ReactElement, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom'
import { disptachType, reducerType } from './store/store';
import { refresh,getUserInfo } from './store/authSlice';
import { ToastContainer } from 'react-toastify';
function App() :ReactElement{
  const Navigate = useNavigate();
  const auth:boolean = useSelector<reducerType>(state=>state.auth.auth) as boolean;
  const dispatch = useDispatch<disptachType>();
  useEffect(()=>{
    if(!auth){
      dispatch(refresh());
    }else{
      dispatch(getUserInfo()).then(()=>{
        const path = location.pathname;
        if(path=='/'){
          Navigate(`/home`,{replace:true});
        }
      });
    }
  },[auth,dispatch,Navigate]);
  return (
      <main className='box-border  relative w-full flex justify-start items-center min-h-screen flex-col'>
        <Outlet/>
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
