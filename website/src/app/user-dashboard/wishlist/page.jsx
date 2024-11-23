"use client"
import BreadCrumb from "@/app/common/BreadCrumb";
import React, { useCallback, useEffect, useState } from "react";
import { AccountSideBar } from "../account/page";
import axios from "axios";
import { websiteBaseUrl } from "@/app/config/config";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setLoginStatus } from "@/app/features/loginStatusSlice";
import { Card } from "@/app/common/Card";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { setCartStatus } from "@/app/features/cartStatusSlice";
import Link from "next/link";


export default function Wishlist() {
  let dispatch=useDispatch()
  let [wishlistData,setWishlistData]=useState([])
  let [productPath,setProductPath]=useState("")
  let [removeWishlistBtn,setremoveWishlistBtn]=useState(false)
  const user=useSelector((state)=>state.userStatus.value)
//   let viewWishlist=()=>{
//     if(!user._id){
//       dispatch(setLoginStatus(true))
//     }
//     else{
//     axios.get(websiteBaseUrl+`wishlist/view-wishlist/${user._id}`)
//     .then((res)=>{
//       if(res.data.status){
//         setWishlistData(res.data.data)
//         setProductPath(res.data.path)
//         setremoveWishlistBtn(true)
//       }
//     })
//     .catch((error)=>{
//       toast.error("Server error occurred.")
//     })
//   }
// }

const viewWishlist = useCallback(() => {
  if (!user._id) {
    dispatch(setLoginStatus(true)); // Show login modal if user is not logged in
  } else {
    axios
      .get(websiteBaseUrl + `wishlist/view-wishlist/${user._id}`)
      .then((res) => {
        if (res.data.status) {
          setWishlistData(res.data.data);
          setProductPath(res.data.path);
          setremoveWishlistBtn(true);
        }
      })
      .catch(() => {
        toast.error("Server error occurred.");
      });
  }
}, [user._id, dispatch]);

useEffect(() => {
  if (user._id) {
    viewWishlist(); // Only call viewWishlist if user._id is available
  }
}, [user._id, viewWishlist]);

// useEffect(()=>{
//   viewWishlist()
// },[user._id])
  return (
    <>
      <section className="pt-28 px-[30px]">
        <BreadCrumb
          prop1={"Home"}
          prop2={"My Account"}
          prop3={"Wishlist"}
        />
        <div className="grid lg:grid-cols-[20%_auto] grid-cols-1 gap-10">
          <AccountSideBar />
          <div>
          <div className="pb-10 border-b border-customBorder">
            <h3 className="md:text-[34px] text-[28px] font-medium">
            Wishlist
            </h3>
            <div className="py-5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
            {wishlistData.length>0 ?
              wishlistData.map((item,index)=>(
                <Card key={index} product={item.product} productPath={productPath} removeWishlistBtn={removeWishlistBtn} viewWishlist={viewWishlist} />
              ))
              :
              <div className=" text-center ">
                <div className="text-[20px] font-semibold mb-3">
                Your Wishlist is empty
                </div>
                <Link href={"/collections"}>
                  <button
                    onClick={() => dispatch(setCartStatus(false))}
                    className="border-2 mx-auto table py-3 px-4 bg-black hover:bg-white text-white duration-500 hover:text-black hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium rounded-md"
                  >
                    Back to shopping
                  </button>
                </Link>
              </div>
            }
            </div>
          </div>
          <div className="md:pt-10 pt-5">
            <h3 className="md:text-[32px] text-[20px] font-medium">
            Picked Just For You
            </h3>
            <div className="md:py-10 py-5 grid lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5">
              {/*  */}
            </div>
          </div>
          </div>
        </div>
      </section>
    </>
  );
}
