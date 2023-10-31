import {lazy,Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import { store } from './store/store.ts';
import {Provider} from 'react-redux'
export const Loading = lazy(()=>import('./components/Loading.tsx'));
export const Home = lazy(()=>import('./pages/Home.tsx'));
export const SocialHome = lazy(()=>import('./pages/SocialHome.tsx'));
export const LandingHome = lazy(()=>import('./pages/LandingHome.tsx'));
export const Notification = lazy(()=>import('./pages/Notification.tsx'));
export const UserProfile = lazy(()=>import('./components/SocialHome/UserProfile.tsx'));
export const Message = lazy(()=>import('./pages/Message.tsx'));
export const SinglePost =lazy (()=>import('./components/SocialHome/SinglePost.tsx'));
const router = createBrowserRouter([
  {
    path:'/',
    element:<App/>,
    children:[
      {
        index:true,
        element:<Suspense fallback={<Loading/>}><Home/></Suspense>
      },
      {
        path:'home',
        element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><SocialHome/></Suspense>,
        children:[
          {
            index:true,
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><LandingHome/></Suspense>
          },
          {
            path:'notification',
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><Notification/></Suspense>
          },
          {
            path:'Message',
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><Message/></Suspense>
          },
          {
            path:'users/:id',
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><UserProfile/></Suspense>
          },
          {
            path:'posts/:id',
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><SinglePost/></Suspense>
          },
          {
            path:'users/:id',
            element:<Suspense fallback={<section className='col-start-1 col-end-13'><Loading/></section>}><UserProfile/></Suspense>
          }
        ]
      }
    ],
  }
]);
ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
)
