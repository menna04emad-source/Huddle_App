
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loginschema , type LoginschemaType } from '../../../Schemas/auth.schema';
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from 'react';
import { toast  } from "react-toastify";
import { Authcontext } from "../../../Context/AuthContext";


export default function Login() {
 const { setuserLogin} = useContext(Authcontext);
const navigate = useNavigate ();
const [apiError] = useState();
const [isLoading, setisLoading] = useState(false)
  const form = useForm<LoginschemaType>({
    defaultValues : {
  email: "",
  password: "",

    },
    resolver: zodResolver(Loginschema) ,
    mode : "onSubmit"  
  })
let {register , handleSubmit , formState } = form ;
function handleLogin(values :LoginschemaType ){
  // console.log(values);
  setisLoading(true)
  axios.post(`https://route-posts.routemisr.com/users/signin`, values)
  .then((res)=>{console.log(res);
      if (res.data.success){
        console.log(res.data.data.token);
        localStorage.setItem("user Token" , res.data.data.token);
        setuserLogin(res.data.data.token);
        toast.success("Logged in!");
        

        setTimeout(() => {
          navigate("/home");
        }, 1500);
  }

  }) 

  .catch((err) => {
  const message =
    err.response?.data?.message || "Something went wrong";
  toast.error(message);
})
.finally(()=>{
  setisLoading(false)
})
}


  return (
    <>
     <h1 className=" text-center text-3xl font-bold">Login Now</h1>
{apiError && <p className=" bg-mauve-700 text-white text-center font-bold p-2 rounded-sm w-[300px] mx-auto">{apiError}</p>}
<form onSubmit={handleSubmit(handleLogin)} className="max-w-md mx-auto my-5">
      

  <div className="relative z-0 w-full mb-5 group">
    <input
    {...register("email")}
     type="email"  id="email" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" "  />
    <label htmlFor="email" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter your Email</label>
  
 <p className=" text-red-500"> {formState.errors.email?.message}</p>
  </div>

  <div className="relative z-0 w-full mb-5 group">
    <input
    {...register("password" )}
     type="password"  id="password" className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"  />
    <label htmlFor="password" className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Enter your Password</label>
 <p className=" text-red-500"> {formState.errors.password?.message}</p>
  
  </div>



<button
disabled = {isLoading}
 type="submit" className="text-white disabled:bg-slate-700 disabled:text-white disabled:cursor-not-allowed bg-emerald-900 w-full rounded-lg cursor-pointer hover:bg-emerald-700 transition-all box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
  {isLoading ? "Loading..." : "Sign in"}
</button>

<div className=" flex justify-center my-2 text-emerald-400 underline cursor-pointer">
  <Link to = {"/register"}>Don't You Have An Account? Go Register</Link></div>
</form>


    </>
  )
}

