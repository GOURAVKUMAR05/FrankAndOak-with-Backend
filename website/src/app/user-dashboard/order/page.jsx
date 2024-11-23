"use client"
import BreadCrumb from "@/app/common/BreadCrumb";
import React, { useEffect, useState } from "react";
import { AccountSideBar } from "../account/page";
import axios from "axios";
import { websiteBaseUrl } from "@/app/config/config";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { format } from 'date-fns';
import Link from "next/link";

export default function Order() {
  let [orderData,setOrderData]=useState([])
  const user = useSelector((state) => state.userStatus.value);
  // console.log(user._id)
  useEffect(()=>{
    if(user._id){
    axios.get(websiteBaseUrl+ `order/view-order/${user._id}`)
    .then((res)=>{
      if(res.data.status){
        setOrderData(res.data.data)
      }
    })
    .catch((error)=>{
      toast.error("Server error occurred.")
    })
  }
  else{
    toast.error("Please Login.")
  }
  },[user._id])
  return (
    <>
      <section className="pt-28 px-[30px]">
        <BreadCrumb
          prop1={"Home"}
          prop2={"My Account"}
          prop3={"Orders & returns"}
        />
        <div className="grid lg:grid-cols-[20%_auto] grid-cols-1 gap-10">
          <AccountSideBar />
          <div>
            <div className="gap-4 sm:flex sm:items-center sm:justify-between">
            <h3 className="md:text-[34px] text-[28px] font-medium">
              Orders & returns
            </h3>
            <div className="mt-6 gap-4 space-y-4 sm:mt-0 sm:flex sm:items-center sm:justify-end sm:space-y-0">
          <div>
            <label for="order-type" className="sr-only mb-2 block text-sm font-medium text-gray-900 ">Select order type</label>
            <select id="order-type" className="block w-full min-w-[8rem] rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
              <option selected>All orders</option>
              <option value="pre-order">Pre-order</option>
              <option value="transit">In transit</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <span className="inline-block text-gray-500"> from </span>

          <div>
            <label for="duration" className="sr-only mb-2 block text-sm font-medium text-gray-900 ">Select duration</label>
            <select id="duration" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500">
              <option selected>this week</option>
              <option value="this month">this month</option>
              <option value="last 3 months">the last 3 months</option>
              <option value="lats 6 months">the last 6 months</option>
              <option value="this year">this year</option>
            </select>
          </div>
        </div>
            </div>
            <div className="bg-white antialiased ">
  <div className="mx-auto max-w-screen-xl px-0 2xl:px-0">
    <div className="mx-auto max-w-5xl">
      <div className="mt-6 flow-root sm:mt-8">
        <div className="divide-y divide-gray-200 space-y-5">
          {orderData.length>0 ?
          orderData.map((order,index)=>(
            <OrderCard key={index} order={order} />
          ))
          :
        <div>
              <div className="text-sm font-medium pb-5">History Empty</div>
              <button className="border border-black hover:shadow-Btn-shadow py-4 px-16 text-[13px] font-medium">
                Shop Now
              </button>
            </div>
}
        </div>
      </div>

    
    </div>
  </div>
</div>
          </div>
        </div>
      </section>
    </>
  );
}


function OrderCard({order}) {
  const isoDate = order.createdAt;
  const formattedDate = format(new Date(isoDate), 'dd.MM.yyyy');
  return (
    <div className="flex flex-wrap items-center gap-y-4 py-6 border rounded-xl shadow-md px-5">
            <dl className="w-1/1 sm:w-1/4  lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 ">Order ID:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 ">
                <a href="#" className="hover:underline">#{order.orderId}</a>
              </dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 ">Date:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 ">{formattedDate}</dd>
            </dl>

            <dl className="w-1/2 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 ">Total Price:</dt>
              <dd className="mt-1.5 text-base font-semibold text-gray-900 ">${order.orderAmount}</dd>
            </dl>

            <dl className="w-1/1 sm:w-1/4 lg:w-auto lg:flex-1">
              <dt className="text-base font-medium text-gray-500 ">Payment Status:</dt>
              {order.paymentStatus=="1" ? (<Pending/>) : order.paymentStatus=="2" ? (<Confirmed/>) : (<Cancelled/>)  }
              {/* <Cancelled/> */}
            </dl>
{/* O order again we will set the cart data to order.productCart */}
            <div className="w-full grid sm:grid-cols-2 lg:flex lg:w-64 lg:items-center lg:justify-end gap-4">
              <button type="button" className="w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4 focus:ring-primary-300  lg:w-auto">Order again</button>
              <Link href={`/user-dashboard/order/order-details/${order._id}`}>
              <button className="w-full inline-flex justify-center rounded-lg  border border-gray-200 bg-[#EBECEE] px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100  lg:w-auto">View details</button>
              </Link>
            </div>
          </div>
  )
}

function Confirmed() {
  return (
    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
  <svg
    className="me-1 h-3 w-3"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M5 11.917 9.724 16.5 19 7.5"
    />
  </svg>
  Confirmed
</dd>
  )
}


function Cancelled() {
  return (
    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                <svg className="me-1 h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
                Cancelled
              </dd>
  )
}

function Pending() {
  return (
    <dd className="me-2 mt-1.5 inline-flex items-center rounded bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
      <svg className="me-1 h-3 w-3" fill="#854D0E" viewBox="0 0 320 512"><path d="M160 0c17.7 0 32 14.3 32 32l0 35.7c1.6 .2 3.1 .4 4.7 .7c.4 .1 .7 .1 1.1 .2l48 8.8c17.4 3.2 28.9 19.9 25.7 37.2s-19.9 28.9-37.2 25.7l-47.5-8.7c-31.3-4.6-58.9-1.5-78.3 6.2s-27.2 18.3-29 28.1c-2 10.7-.5 16.7 1.2 20.4c1.8 3.9 5.5 8.3 12.8 13.2c16.3 10.7 41.3 17.7 73.7 26.3l2.9 .8c28.6 7.6 63.6 16.8 89.6 33.8c14.2 9.3 27.6 21.9 35.9 39.5c8.5 17.9 10.3 37.9 6.4 59.2c-6.9 38-33.1 63.4-65.6 76.7c-13.7 5.6-28.6 9.2-44.4 11l0 33.4c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-34.9c-.4-.1-.9-.1-1.3-.2l-.2 0s0 0 0 0c-24.4-3.8-64.5-14.3-91.5-26.3c-16.1-7.2-23.4-26.1-16.2-42.2s26.1-23.4 42.2-16.2c20.9 9.3 55.3 18.5 75.2 21.6c31.9 4.7 58.2 2 76-5.3c16.9-6.9 24.6-16.9 26.8-28.9c1.9-10.6 .4-16.7-1.3-20.4c-1.9-4-5.6-8.4-13-13.3c-16.4-10.7-41.5-17.7-74-26.3l-2.8-.7s0 0 0 0C119.4 279.3 84.4 270 58.4 253c-14.2-9.3-27.5-22-35.8-39.6c-8.4-17.9-10.1-37.9-6.1-59.2C23.7 116 52.3 91.2 84.8 78.3c13.3-5.3 27.9-8.9 43.2-11L128 32c0-17.7 14.3-32 32-32z"/></svg>
                Pending
              </dd>
  )
}
