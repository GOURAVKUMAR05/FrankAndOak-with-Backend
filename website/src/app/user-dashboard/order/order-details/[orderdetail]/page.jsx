"use client"
import { websiteBaseUrl } from '@/app/config/config'
import { setCancelOrderStatus } from '@/app/features/cancelOrderStatusSlice';
import CancelOrder from '@/app/modals/CancelOrder';
import axios from 'axios'
import { addDays, format, parseISO } from 'date-fns';
import Link from 'next/link';

import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux';

export default function OrderDetails() {
    let dispatch=useDispatch()
    let {orderdetail}=useParams()
    let [orderData,setOrderData]=useState([])
    let [orderProcessingDetail,setOrderProcessingDetail]=useState({})
    let [productPath,setProductPath]=useState("")

    useEffect(()=>{
        axios.get(websiteBaseUrl+`order/order-detail/${orderdetail}`)
        .then((res)=>{
            if(res.data.status){
                setOrderData(res.data.data.productCart)
                setProductPath(res.data.path)
                setOrderProcessingDetail(res.data.data)
            }
            else{
                toast.error(res.data.message)
            }
        })
        .catch((error)=>{
            toast.error("Server error occurred.")
        })
    },[orderdetail])

    // Ordered Data
    const orderDate = orderProcessingDetail?.createdAt;
    const formattedDate =orderDate ? format(parseISO(orderDate), 'd MMMM yyyy') : "XX XX XXXX";

    // Expeted Delivery Date
    const deliveryDate = orderDate ? addDays(parseISO(orderDate), 4) : null; // Add 4 days (change to 3 for 3 days)
    const formattedDeliveryDate = deliveryDate ? format(deliveryDate, 'd MMMM yyyy') : 'Loading...';
  return (
    <section className="py-24 relative">
    <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="font-manrope font-semibold text-4xl leading-10 text-black text-center pb-5">
            My Order Details
        </h2>
        <div className="main-box border border-gray-200 rounded-xl pt-6 max-w-xl max-lg:mx-auto lg:max-w-full">
            <div
                className="flex flex-col lg:flex-row lg:items-center justify-between px-6 pb-6 border-b border-gray-200">
                <div className="data">
                    <p className="font-semibold text-base leading-7 text-black">Order Id: <span className="text-indigo-600 font-medium">#{orderProcessingDetail.orderId}</span></p>
                    <p className="font-semibold text-base leading-7 text-black mt-4">Order Payment : <span className="text-gray-600 font-semibold">{formattedDate}</span></p>
                </div>
                <Link href={"/collections"}>
                <button
                    className="rounded-full py-3 px-7 font-semibold text-sm leading-7 text-white bg-black max-lg:mt-5 shadow-sm shadow-transparent transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">Back to shopping</button>
                </Link>
            </div>
            <div className="w-full px-3 min-[400px]:px-6">
                {
                    orderData.length>0 ?
                    orderData.map((order,index)=>(
                        <Link key={index} href={`/product/product-details/${order.product.slug}`}>
                <div key={index} className="flex flex-col lg:flex-row items-center py-6 border-b border-gray-200 gap-6 w-full">
                    <div className="img-box max-lg:w-full">
                        <img src={productPath+order.product.productImage} alt={order.product.productName} 
                            className="aspect-square object-top w-full lg:max-w-[140px] rounded-xl object-cover"/>
                    </div>
                    <div className="flex flex-row items-center w-full ">
                        <div className="grid grid-cols-1 lg:grid-cols-2 w-full">
                            <div className="flex items-center">
                                <div className="">
                                    <h4 className="font-semibold text-xl leading-8 text-black mb-3">
                                        {order.product.productName}</h4>
                                    <p className="font-normal text-[14px] line-clamp-2 md:w-[80%] w-[100%] text-gray-500 mb-3 ">
                                        {order.product.productShortDesc}</p>
                                    <div className="flex items-center ">
                                        <p
                                            className="font-medium text-base leading-7 text-black pr-4 mr-4 border-r border-gray-200">
                                            Size: <span className="text-gray-500">{order.size.sizeName}</span></p>
                                        <p className="font-medium text-base leading-7 text-black ">Qty: <span
                                                className="text-gray-500">{order.quantity}</span></p>
                                    </div>
                                </div>

                            </div>
                            <div className="grid grid-cols-5">
                                <div className="col-span-5 lg:col-span-1 flex items-center max-lg:mt-3">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm leading-7 text-black">Price</p>
                                        <p className="lg:mt-4 font-medium text-sm leading-7 text-indigo-600">${order.product.productPrice}</p>
                                    </div>
                                </div>
                                <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3 ">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm leading-7 text-black">Status
                                        </p>
                                        <p
                                            className={`font-medium text-sm leading-6 whitespace-nowrap py-0.5 px-3 rounded-full lg:mt-3 ${orderProcessingDetail.orderStatus=="Cancelled" ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"} `}>
                                            {orderProcessingDetail.orderStatus=="Pending" ? "Pending" : orderProcessingDetail.orderStatus=="Processing" ? "Processing" : orderProcessingDetail.orderStatus=="Shipped" ? "Shipped" : orderProcessingDetail.orderStatus=="Delivered" ? "Delivered" : "Cancelled"  }</p>
                                    </div>

                                </div>
                                <div className="col-span-5 lg:col-span-2 flex items-center max-lg:mt-3">
                                    <div className="flex gap-3 lg:block">
                                        <p className="font-medium text-sm whitespace-nowrap leading-6 text-black">
                                            Expected Delivery Time</p>
                                        <p className="font-medium text-base whitespace-nowrap leading-7 lg:mt-3 text-emerald-500">
                                            {formattedDeliveryDate}</p>
                                    </div>

                                </div>
                            </div>
                        </div>


                    </div>
                </div>      
                        </Link>
                        ))
                :
                ""                    
                }

            </div>
            <div className="w-full border-t border-gray-200 px-6 flex flex-col lg:flex-row items-center justify-between ">
                <div className="flex flex-col sm:flex-row items-center max-lg:border-b border-gray-200">
                    {orderProcessingDetail.orderStatus=="Cancelled" ?
                    <div className="flex outline-0 py-6 sm:pr-6  sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg  bg-white transition-all duration-500 text-red-600">Order Cancelled</div>
                    :
                    <button onClick={()=>dispatch(setCancelOrderStatus(true))}
                        className="flex outline-0 py-6 sm:pr-6  sm:border-r border-gray-200 whitespace-nowrap gap-2 items-center justify-center font-semibold group text-lg  bg-white transition-all duration-500 text-red-600">
                        <svg className="transition-all duration-500 stroke-red-600" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"
                            fill="none">
                            <path d="M5.5 5.5L16.5 16.5M16.5 5.5L5.5 16.5" stroke="" stroke-width="1.6"
                                stroke-linecap="round" />
                        </svg>
                        Cancel Order
                    </button>
}
                    <CancelOrder orderProcessingDetail={orderProcessingDetail} formattedDate={formattedDate} />
                    <p className="font-medium text-lg text-gray-900 pl-6 py-3 max-lg:text-center">Paid using <span className="text-gray-600 font-semibold">{orderProcessingDetail.paymentType==1 ? "Cash on Delivery (COD)" : "Online Payment"}</span></p>
                </div>
                <p className="font-semibold text-lg text-black py-6">Total Price: <span className="text-indigo-600"> ${orderProcessingDetail.orderAmount}</span></p>
            </div>

        </div>
    </div>
</section>
                                        
  )
}
