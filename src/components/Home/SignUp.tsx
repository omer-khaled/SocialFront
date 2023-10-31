import { useFormik } from 'formik'
import {ReactElement,useState,ChangeEvent,useContext} from 'react'
import * as YUP from 'yup';
import {useDispatch,useSelector} from 'react-redux';
import {disptachType,reducerType} from '../../store/store';
import { signup } from '../../store/authSlice';
import { errorType } from '../../types/type';
import ReactLoading from 'react-loading';
import { contextOpen } from '../../pages/Home';
function SignUp():ReactElement {
    const setOpenSignup = useContext(contextOpen);
    const dispatch = useDispatch<disptachType>();
    const [action,setAction] = useState<boolean>(false);
    const [file,setFile] = useState<File|null>(null);
    const [imageError,setImageError] = useState<string|null>(null);
    const [image,setImage] = useState<string|null>(null);
    const errors:null|errorType[] = (useSelector<reducerType>(state=>state.auth.signupErrors) as null|errorType[]);
    const validationShcema = YUP.object({
        email:YUP.string().required('required feild').email('invalid email').matches(/^[\w\W]+@gmail\.com$/,'invalid gmail account'),
        password:YUP.string().required('required feild').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\w\W]{8,}$/,'weak password 8 character or more (atleast one digit , small , capital , spechial carachter)'),
        name:YUP.string().required('required feild').matches(/^[\W\w]{3,}$/,'name should be at least 3 character')
    });
    const formik = useFormik({
        initialValues:{
            email:'',
            password:'',
            name:''
        },
        validationSchema:validationShcema,
        onSubmit:(values)=>{
            if(!file){
              setImage(null);
              return setImageError('required feild');
            }
            setAction(true);
            dispatch(signup({...values,image:file})).then(()=>{
                if(setOpenSignup){
                    setOpenSignup(false);
                }
            });
        }
    });
  return (
    <form onSubmit={(e)=>{
        e.preventDefault();
        formik.handleSubmit();
    }} className='w-2/4 box-border p-4 rounded-md relative bg-white max-lg:mx-auto max-lg:w-3/4'>
        <svg className='absolute top-8 right-8 cursor-pointer text-red-600 text-lg' onClick={()=>{
            if(setOpenSignup){
                setOpenSignup(false);
            }
        }} stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" fill-rule="evenodd" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z"></path></svg>
        <p className='p-0 m-0 mb-4 text-4xl font-bold underline'>Sign Up</p>
        <div className='w-full'>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Email' className={`form-control ${(formik.errors.email&&formik.touched.email)?'border-red-500':(formik.touched.email?'border-primary':'')}`} type="email" name="email"/>
            {(formik.errors.email&&formik.touched.email)&&<p className='m-0 p-0 text-red-500'>{formik.errors.email}</p>}
        </div>
        <div className='w-full my-3 max-lg:my-5'>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Name' className={`form-control ${(formik.errors.name&&formik.touched.name)?'border-red-500':(formik.touched.name?'border-primary':'')}`} type="text" name="name"/>
            {(formik.errors.name&&formik.touched.name)&&<p className='m-0 p-0 text-red-500'>{formik.errors.name}</p>}
        </div>
        <div className='w-full my-3 max-lg:my-5'>
            <input className={`form-control border-primary`} type="file" name="file" onChange={(e:ChangeEvent<HTMLInputElement>)=>{
                if( e.target.files){
                    const file = e.target.files[0];
                    const allowedTypes = ['image/jpeg','image/jpg','image/png'];
                    if(file){
                        if(!allowedTypes.includes(file.type)){
                            setFile(null);
                            setImage(null);
                            setImageError('should be .png .jpg .jpeg')
                        }
                        else{
                            setImageError(null);
                            setImage(URL.createObjectURL(file));
                            setFile(file);
                        }
                    }else{
                        setImageError('required feild')
                    }
                }
            }}/>
            {(imageError)&&<p className='m-0 p-0 text-red-500'>{imageError}</p>}
        </div>
        {(image&&!imageError)&&<img src={image} className='image-fluid object-contain m-0 p-0' width={"160px"} alt='personal image'/>}
        <div className='w-full my-3 max-lg:my-5'>
            <input onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder='Password' className={`form-control ${(formik.errors.password&&formik.touched.password)?'border-red-500':(formik.touched.password?'border-primary':'')}`} type="password" name="password"/>
            {(formik.errors.password&&formik.touched.password)&&<p className='m-0 p-0 text-red-500'>{formik.errors.password}</p>}
        </div>
        {
            (errors)?((errors.length===0)?<></>:<div className='my-3'>{errors.map((el:errorType)=>{
                return(<p className='m-0 mb-1 text-red-500 p-2 box-border bg-red-200 rounded-md'>{el.msg}</p>);
            })}</div>):<></>
        }
        <button type='submit' className='w-full block bg-primary text-white text-lg p-2 px-4 cursor-pointer mx-auto focus:outline-none'>{(action)?<ReactLoading className='mx-auto' color='#f0f2f5' type='spin' width={"30px"} height={"30px"}/>:"Sign Up"}</button>
    </form>
  )
}
export default SignUp;