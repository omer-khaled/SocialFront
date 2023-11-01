import { useFormik } from 'formik'
import {ReactElement,useState} from 'react'
import { useNavigate } from 'react-router-dom'
import * as YUP from 'yup';
import { baseUrl, errorType, responseLoginApi } from '../../types/type';
import ReactLoading from 'react-loading';
import axios, { AxiosError } from 'axios';
import api from '../../utils/axiosModule';
import { useDispatch } from 'react-redux';
import { disptachType } from '../../store/store';
import { getUserInfo, makeAuthTrue } from '../../store/authSlice';

export default function Login():ReactElement {
    const Navigate = useNavigate();
    const [action,setAction] = useState<boolean>(false);
    const [errors,setError] = useState<errorType[]|null>(null);
    const dispatch = useDispatch<disptachType>();
    const validationShcema = YUP.object({
        email:YUP.string().required('required feild').email('invalid email').matches(/^[\w\W]+@gmail\.com$/,'invalid gmail account'),
        password:YUP.string().required('required feild').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\w\W]{8,}$/,'weak password 8 character or more (atleast one digit , small , capital , spechial carachter)')
    });
    const formik = useFormik({
        initialValues:{
            email:'',
            password:''
        },
        validationSchema:validationShcema,
        onSubmit:(values)=>{
            setAction(true);
            (async()=>{
               try{
                    const url = baseUrl+'/auth/login';
                    const {data}:{data:responseLoginApi} =await axios.post(url,JSON.stringify({
                        email:values.email,
                        password:values.password
                    }),{
                        headers:{
                            'Content-Type':'application/json'
                        },
                        withCredentials:true,
                    });
                    if(data.accessToken&&data.status){
                        dispatch(makeAuthTrue());
                        setAction(false);
                        api.defaults.headers.common['Authorization'] = "Bearer "+data.accessToken;
                        dispatch(getUserInfo());
                        Navigate('/',{replace:true});
                    }
               }catch(e){
                 setAction(false);
                 setError(((e as AxiosError).response?.data as {status:boolean,error:errorType[]}).error);
               }
            })()
        }
    });
  return (
    <form onSubmit={(e)=>{
        e.preventDefault();
        formik.handleSubmit();
    }} className='w-3/4 box-border p-4 pb-0 rounded-md bg-white max-lg:mx-auto'>
        <div className='w-full'>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Email' className={`form-control ${(formik.errors.email&&formik.touched.email)?'border-red-500':(formik.touched.email?'border-primary':'')}`} type="email" name="email"/>
            {(formik.errors.email&&formik.touched.email)&&<p className='m-0 p-0 text-red-500'>{formik.errors.email}</p>}
        </div>
        <div className='w-full my-3 max-lg:my-5'>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Password' className={`form-control ${(formik.errors.password&&formik.touched.password)?'border-red-500':(formik.touched.password?'border-primary':'')}`} type="password" name="password"/>
            {(formik.errors.password&&formik.touched.password)&&<p className='m-0 p-0 text-red-500'>{formik.errors.password}</p>}
        </div>
        {
            (errors)?((errors.length===0)?<></>:<div className='my-3'>{errors.map((el:errorType,index:number)=>{
                return(<p key={index} className='m-0 mb-1 text-red-500 p-2 box-border bg-red-200 rounded-md'>{el.msg}</p>);
            })}</div>):<></>
        }
        <button type='submit' className='w-full block bg-primary text-white text-lg p-2 px-4 cursor-pointer mx-auto focus:outline-none'>{(action)?<ReactLoading className='mx-auto' color='#f0f2f5' type='spin' width={"30px"} height={"30px"}/>:"Log In"}</button>
    </form>
  )
}
