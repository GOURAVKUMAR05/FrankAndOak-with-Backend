"use client"
import React, { useEffect, useState } from 'react'
import { RxHamburgerMenu } from "react-icons/rx";
import { CiHeart, CiSearch } from "react-icons/ci";
import { FaRegUserCircle } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { BsBagPlus } from "react-icons/bs";
import Login from '../auth/Login';
import MobileSideBar from '../modals/MobileSideBar';
import Link from 'next/link';
import { MenMegaMenu, OurStoryMegaMenu, ThisJustInMegaMenu, WomenMegaMenu } from './MegaMenu';
import TextSlider from './TextSlider';
import Cart from '../modals/Cart';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { setLoginStatus } from '../features/loginStatusSlice';
import axios from 'axios';
import { websiteBaseUrl } from '../config/config';
import { setCartStatus } from '../features/cartStatusSlice';
import 'react-loading-skeleton/dist/skeleton.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { logOut } from '../features/userSlice';
export default function Header() {
  const userStatus=useSelector((state)=> state.userStatus.value)
  let dispatch=useDispatch()
  let [menuHover,setMenuHover]=useState(0)
  let [sidebarStatus,setSidebarStatus]=useState(false)
  let [afterLoginHover,setAfterLoginHover]=useState(false)
  let [parentCatData,setParentCatData]=useState([])
  

  useEffect(()=>{
    axios.get(websiteBaseUrl+"collections/parent-category")
    .then((res)=>{
      if(res.data.status){
        setParentCatData(res.data.dataList)
      }
    })
  },[])
  
  return (
    <div className='fixed top-0 z-[999999999] w-full'>

<Login />
<Cart/>
    <TextSlider/>
    <Toaster
  position="bottom-right"
  containerStyle={{
    zIndex: 9999999999999999, // Ensure the high z-index is applied
  }}
  reverseOrder={false}
/>
    <header className='shadow-md py-2 lg:py-1 px-2 sm:px-4 md:px-10 bg-white flex justify-between'>
      <div className='  flex gap-2 sm:gap-4 items-center  basis-[70%] md:basis-[20%] lg:basis-[15%]'>
      <RxHamburgerMenu onClick={()=>setSidebarStatus(true)} className='sm:hidden block w-[22px] h-7' />
      <MobileSideBar sidebarStatus={sidebarStatus}/>
      <Link href={"/"}>
      <span className='font-bold md:text-[18px] text-[15px] cursor-pointer'>Frank And Oak</span>
      </Link>
      </div>
      <nav className=' basis-[30%] lg:basis-[84%] md:basis-[75%]  flex items-center justify-end lg:justify-between'>
        <div className='lg:block  hidden'>
          <ul className='flex gap-6 text-[15px] font-medium'>
            {parentCatData.map((item,index)=>{
            return <li key={index} onMouseOver={()=>setMenuHover(1)} onMouseOut={()=>setMenuHover(0)} className='hover:bg-[#F9F9F9] cursor-pointer hover:underline underline-offset-4 px-3 duration-500 p-2'>
              <Link href={`/category/${item.slug}`}>
              {item.categoryName}
              </Link>
            <ThisJustInMegaMenu menuHover={menuHover} setMenuHover={setMenuHover} />
            </li>
            })}
            <Link href={"/pages/our-story"}>
            <li onMouseOver={()=>setMenuHover(4)} onMouseOut={()=>setMenuHover(0)} className='hover:bg-[#F9F9F9] cursor-pointer hover:underline underline-offset-4 px-3 duration-500 p-2'>Our Story
            <OurStoryMegaMenu menuHover={menuHover} setMenuHover={setMenuHover} />
            </li>
            </Link>
            {/* <li onMouseOver={()=>setMenuHover(2)} onMouseOut={()=>setMenuHover(0)} className='hover:bg-[#F9F9F9] cursor-pointer hover:underline underline-offset-4 px-3 duration-500 p-2'>Women
            <WomenMegaMenu menuHover={menuHover} setMenuHover={setMenuHover} />
            </li>
            <li onMouseOver={()=>setMenuHover(3)} onMouseOut={()=>setMenuHover(0)} className='hover:bg-[#F9F9F9] cursor-pointer hover:underline underline-offset-4 px-3 duration-500 p-2'>Men
            <MenMegaMenu menuHover={menuHover} setMenuHover={setMenuHover} />
            </li>
            <li onMouseOver={()=>setMenuHover(4)} onMouseOut={()=>setMenuHover(0)} className='hover:bg-[#F9F9F9] cursor-pointer hover:underline underline-offset-4 px-3 duration-500 p-2'>Our Story
            <OurStoryMegaMenu menuHover={menuHover} setMenuHover={setMenuHover} />
            </li> */}
          </ul>
        </div>
        <ul className='flex gap-3 sm:gap-5'>
          <li>
            <Link href={"/pages/search"}>
          <CiSearch className='sm:w-7 sm:h-7 h-5 w-5'  />
          </Link>
          </li>
          <li className='cursor-pointer group relative' onClick={userStatus._id ? ()=>setAfterLoginHover(true) : ()=> dispatch(setLoginStatus(true))}>
          <FaRegUserCircle className='sm:w-[22px]  sm:h-7 h-5 w-[18px] ' />
          {afterLoginHover ? <div className='w-[300px] rounded-md shadow-lg absolute top-7 end-0 group-hover:block hidden bg-white'>
            <div>
              <h3 className='bg-[#EBECEE] rounded-t-md text-[18px] p-3 font-semibold'>My Account</h3>
              <div className='bg-[#262821] px-3 py-4'>
                <div className='text-white flex items-center justify-between'>
                  <h5 className='text-[20px] font-semibold'>Hi, {userStatus.firstName || "User"}!</h5>
                  <svg xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                  <path d="M11.1609 0.68682V1.02557L11.1857 1.22447C11.1857 1.32702 11.1857 1.42647 11.2199 1.52592C11.2541 1.62226 11.2199 1.66888 11.2541 1.74347C11.2883 1.81805 11.2821 1.92993 11.3007 2.02317C11.3163 2.1164 11.3287 2.17234 11.3473 2.24693C11.3629 2.32462 11.3815 2.42407 11.4033 2.5142C11.425 2.60432 11.4406 2.66337 11.4592 2.73796C11.4748 2.81565 11.5027 2.91199 11.5276 2.9959C11.5524 3.07981 11.5742 3.14508 11.596 3.21966L11.6737 3.46829L11.7482 3.68894L11.8384 3.93445L11.9223 4.152C11.9565 4.2328 11.9844 4.3136 12.0248 4.38819L12.1181 4.60573L12.2299 4.83571L12.3356 5.04704L12.4506 5.2708L12.5656 5.47281L12.693 5.69035L12.8173 5.88925L12.9541 6.09747L13.0877 6.29326C13.1343 6.36163 13.1809 6.43 13.2307 6.49216L13.3705 6.67863C13.4202 6.747 13.4731 6.80915 13.5228 6.8682L13.672 7.05156L13.8336 7.23492C13.8833 7.29397 13.9392 7.35302 13.9952 7.40896L14.1599 7.58299L14.3246 7.7477L14.5017 7.91242L14.6758 8.06781L14.8622 8.22319L15.0394 8.36615L15.2725 8.5029L15.4527 8.63964L15.6547 8.77638L15.8443 8.9038L16.0556 9.03122L16.2514 9.14621L16.4752 9.2643L16.671 9.36064L16.9072 9.46942L17.1029 9.55954L17.3578 9.65588L17.5443 9.72736L17.8333 9.8237L18.0042 9.87343C18.1285 9.91072 18.259 9.94491 18.3865 9.97598L18.4704 9.99774C18.6258 10.035 18.7874 10.0661 18.949 10.0941L19.0981 10.1158L19.4369 10.1625H19.6327C19.7352 10.1625 19.8316 10.1625 19.9341 10.1873H21.0001V0H11.1484V0.509676L11.1733 0.683714L11.1609 0.68682Z" fill="#D2E8C4"></path><path d="M18.1079 15.0509C18.1079 14.7215 18.0581 14.3951 17.9587 14.0781C17.9276 13.9756 17.8903 13.8761 17.8499 13.7767C17.5609 13.093 17.0481 12.5274 16.3955 12.1731C16.209 12.0736 16.0101 11.9959 15.8081 11.9338C15.5999 11.8685 15.3854 11.825 15.1679 11.8064C14.9472 11.7846 14.7204 11.7846 14.4997 11.8064C14.2822 11.8281 14.0709 11.8716 13.8626 11.9338C13.7601 11.968 13.6606 12.0021 13.5612 12.0457C13.1416 12.2228 12.7625 12.487 12.4517 12.8195C12.1409 13.152 11.9016 13.5467 11.7493 13.9787C11.5971 14.4107 11.538 14.8675 11.5753 15.3213C11.6126 15.775 11.7431 16.2194 11.9576 16.6203C11.9762 16.6514 11.998 16.6825 12.0135 16.7167C12.0663 16.8037 12.1223 16.8907 12.1844 16.9746C12.5884 17.534 13.1603 17.9536 13.816 18.168C14.4718 18.3824 15.1803 18.3855 15.8392 18.1742C16.498 17.9629 17.0699 17.5464 17.477 16.987C17.8841 16.4276 18.1048 15.7532 18.1048 15.0633V15.0478L18.1079 15.0509Z" fill="#D2E8C4"></path><path d="M7.85646 2.99268L0.102539 5.44472L5.33915 21.9999C9.8703 18.0095 10.8337 10.9797 7.85957 2.99268H7.85646Z" fill="#D2E8C4"></path>
                  </svg>
                </div>
              </div>
                <div className=' px-3 py-5'>
                <ul className='space-y-3'>
                <li className='font-medium text-[15px]'>
          <Link href={"/user-dashboard/wishlist"} className='flex items-center gap-1'>Wishlist <CiHeart size={20} /></Link>
          </li>
          <li className='font-medium text-[15px]'>
            <Link href={"/user-dashboard/order"}>Orders & returns</Link>
            </li>
          <li className='font-medium text-[15px]'>Address book</li>
          <li className='font-medium text-[15px]'>
          <Link href={"/user-dashboard/account"}>Account settings</Link>
          </li>
          <li className='font-medium text-[15px]'>Frank&apos;s Club</li>
          <li className='font-medium text-[15px]'>Refer a Friend</li>
        </ul>
        <button onClick={()=>dispatch(logOut())} className='text-sm underline underline-offset-2 pt-4 pb-2 uppercase font-semibold mx-auto table'>Logout</button>
                </div>

            </div>
          </div> : ""}

           
          </li>
          <li>
            <Link href={"/user-dashboard/wishlist"}>
          <FaRegHeart className='sm:w-[22px] sm:h-7 h-5 w-[18px] cursor-pointer' />
            </Link>
          </li>
          <li className='cursor-pointer' onClick={()=>dispatch(setCartStatus(true))}>
          <BsBagPlus className='sm:w-[22px] sm:h-7 h-5 w-[18px]' />
          </li>
        </ul>
      </nav>
    </header>
    </div>
  )
}


