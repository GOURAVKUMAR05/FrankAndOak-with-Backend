import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminBaseURL } from '../../config/config'
import toast, { Toaster } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { adminDataStore } from '../../reducers/adminSlice';

export default function Login() {
    let [loginRedirectStatus,setLoginRedirectStatus]=useState(false)
    let [showPassword,setShowPassword]=useState(false)
    const dispatch=useDispatch()
    let handleLogin=(event)=>{
        event.preventDefault()
        let authData={
            uemail:event.target.uemail.value,
            upassword:event.target.upassword.value
        }
        axios.post(AdminBaseURL+"/auth/login",authData)
        .then((res)=>{
            if(res.data.status){
                console.log(res.data)
                dispatch(adminDataStore(res.data.data))
                setLoginRedirectStatus(true)
            }
            else{
                toast.error(res.data.message)
            }
        })
    }
    let navigator=useNavigate()
    useEffect(()=>{
        if(loginRedirectStatus){
            navigator("/home")
        }
    },[loginRedirectStatus])
  return (
    <section className="bg-gray-50 font-urbanist">
      <Toaster />

      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Frank and Oak
        </a>
        <div className="w-[500px] bg-white rounded-lg shadow-2xl">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Sign in to your account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="uemail"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                />
              </div>
              <div className='relative'>
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="upassword"
                  id="password"
                  placeholder="xxxxxx"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                  required
                />
                <div className='z-[99999] absolute right-4 top-[60%]'>
                    {showPassword ? 
                    <svg
                    onClick={()=>setShowPassword(false)}
                    class="cursor-pointer w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 5c7 0 10 7 10 7s-3 7-10 7-10-7-10-7 3-7 10-7z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  :
                  <svg
                  onClick={()=>setShowPassword(true)}
                    class="cursor-pointer w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 5c7 0 10 7 10 7s-3 7-10 7-10-7-10-7 3-7 10-7z"></path>
                    <path
                      d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"
                      fill="none"
                    ></path>
                    <circle cx="12" cy="12" r="3" fill="currentColor"></circle>
                    <line
                      x1="2"
                      y1="2"
                      x2="22"
                      y2="22"
                      stroke="currentColor"
                    ></line>
                  </svg>
                  }
                </div>
              </div>
              <div className="flex items-center justify-between"></div>

              <button
                type="submit"
                className="w-full text-white  bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
