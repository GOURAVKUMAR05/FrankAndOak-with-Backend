"use client"
import axios from 'axios'
import React, { useState } from 'react'
import { websiteBaseUrl } from '../config/config'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setCancelOrderStatus } from '../features/cancelOrderStatusSlice'

export default function CancelOrder({ orderProcessingDetail, formattedDate}) {

    let dispatch=useDispatch()
  const cancelOrderStatus=useSelector((state)=> state.cancelOrderStatus.value)
    let submitCancellation=(event)=>{
        event.preventDefault()
        let cancelledData={
            reason:event.target.reason.value,
            comment:event.target.comment.value,
            order:orderProcessingDetail._id,
            user:orderProcessingDetail.user
        }
        // console.log(cancelledData)
        axios.post(websiteBaseUrl+"order/cancel-order",cancelledData)
        .then((res)=>{
            if(res.data.status){
                toast.success(res.data.message)
                dispatch(setCancelOrderStatus(false))
            }
            else{
                toast.error(res.data.message)
            }
        })
        .catch((error)=>{
            toast.error("Server error occurred")
        })
    }
    // console.log(orderProcessingDetail)
  return (
    <>
    {cancelOrderStatus ?  
    <div class="min-h-screen w-full absolute top-0 left-0 z-[99999999999] bg-gray-100 flex items-center justify-center p-4">
    <form onSubmit={submitCancellation} class="w-full max-w-2xl bg-white shadow-xl rounded-lg">
        <div class="border-b border-gray-200 p-6">
            <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-800">Cancel Order</h1>
                <button onClick={()=>dispatch(setCancelOrderStatus(false))} class="text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
        <div class="p-6">
            <div class="flex items-center mb-6">
                <div class="bg-gray-200 p-3 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                </div>
                <div>
                    <h2 class="text-lg font-semibold text-gray-800">Order #{orderProcessingDetail.orderId}</h2>
                    <p class="text-sm text-gray-500">Placed on {formattedDate}</p>
                </div>
            </div>
            <div class="space-y-4">
                <div>
                    <label for="reason" class="block text-sm font-medium text-gray-700 mb-1">
                        Reason for cancellation
                    </label>
                    <select id="reason" name='reason' class="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400">
                        <option value="">Select a reason</option>
                        <option value="changed_mind">Changed my mind</option>
                        <option value="found_better_price">Found a better price elsewhere</option>
                        <option value="no_longer_needed">Item no longer needed</option>
                        <option value="mistake">Ordered by mistake</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <label for="comments" class="block text-sm font-medium text-gray-700 mb-1">
                        Additional comments (optional)
                    </label>
                    <textarea
                        id="comments"
                        name='comment'
                        rows="3"
                        class="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                        placeholder="Please provide any additional details about your cancellation..."
                    ></textarea>
                </div>
            </div>
        </div>
        <div class="flex justify-end space-x-4 border-t border-gray-200 p-6">
            <button onClick={()=>dispatch(setCancelOrderStatus(false))} class="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50">
                Keep Order
            </button>
            <button type='submit' class="px-4 py-2 bg-black text-white hover:bg-gray-900 rounded-md">
                Confirm Cancellation
            </button>
        </div>
    </form>
</div>
: 
""
    }
</>
  )
}
