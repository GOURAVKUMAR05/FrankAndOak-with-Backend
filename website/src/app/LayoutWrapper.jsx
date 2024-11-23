"use client"
import React, { useEffect, useState } from "react";
import Header from "./common/Header";
import Footer from "./common/Footer";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import DiscountModel from "./modals/DiscountModel";

export default function LayoutWrapper({ children }) {

  let [removeCommons,setRemoveCommons]=useState(true)
  const router=usePathname()
  // console.log(router)

  useEffect(()=>{
    if(router === "/checkouts" || router==="/pages/thankyou" || router==="/account/otp-verification" || router==="/account/forget-password"){
      setRemoveCommons(false)
      
    }
    else{
      setRemoveCommons(true)
    }
  },[router])

  const loginStatus=useSelector((state)=> state.loginStatus.value)
  const cartStatus=useSelector((state)=> state.cartStatus.value)
  const cancelOrderStatus=useSelector((state)=> state.cancelOrderStatus.value)

  return (
    <main className={`${loginStatus || cartStatus || cancelOrderStatus ? "overflow-hidden h-screen" : "overflow-auto h-auto"}`}>
      {/* <Header/> */}
      { removeCommons && <Header /> }
      <DiscountModel/>
      {children}
      {removeCommons && <Footer /> }
      {/* <Footer/> */}
    </main>
  );
}