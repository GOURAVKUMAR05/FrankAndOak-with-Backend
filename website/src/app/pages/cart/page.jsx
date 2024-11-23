"use client";
import { websiteBaseUrl } from "@/app/config/config";
import { fetchCartData } from "@/app/features/cartListSlice";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function CartPage() {
  let dispatch=useDispatch()
  let [viewcartData, setViewCartData] = useState([]);
  let [productPath, setProductPath] = useState("");
  let user=Cookies.get("frank_Oak_User") ? JSON.parse(Cookies.get("frank_Oak_User")) : {}

  let cartObject=useSelector((state)=>state.cartList.value)

  useEffect(()=>{
    if(user._id){
      dispatch(fetchCartData(user._id))
    }
  },[dispatch,user._id])

  useEffect(()=>{
    if(cartObject.data!==undefined){
      setViewCartData(cartObject.data)
      setProductPath(cartObject.path);
    }
  },[cartObject])

  const totalPrice = viewcartData.reduce((acc, item) => {
    return acc + item.product.productPrice * item.quantity;
  }, 0).toFixed(2);

  let updateQuantity = (cartId, status, item) => {
    let productQty = status
      ? item.quantity + 1
      : item.quantity - 1;

    if (productQty < 1) {
      productQty = 1;
      toast("Minimum quantity of 1 !", {
        icon: "⚠️",
      });
    }
    if (productQty > 5) {
      productQty = 5;
      toast("Maximum quantity of 5 !", {
        icon: "⚠️",
      });
    }

    let updateDetail = {
      cartId,
      productQty,
    };
    console.log(updateDetail);
    axios
      .put(websiteBaseUrl + "/cart/update-cart", updateDetail)
      .then((res) => {
        dispatch(fetchCartData(user._id))
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  let deleteProduct=(itemId)=>{
    if(user._id){
      axios.delete(websiteBaseUrl+`cart/delete-cart-product/${itemId}`)
      .then((res)=>{
        if(res.data.status){
          toast.success(res.data.message)
          dispatch(fetchCartData(user._id))
        }
      })
      .catch((error)=>{
        toast.error(error.message);
      })
    }
  }
  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="title font-manrope font-semibold text-4xl leading-10 mb-8  text-black">
          Your Cart
        </h2>
        {viewcartData.length > 0 ? (
          viewcartData.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border-2 border-gray-200 p-4 lg:p-8 grid grid-cols-12 mb-8 max-lg:max-w-lg max-lg:mx-auto gap-y-4 "
            >
              <div className="col-span-12 lg:col-span-2 img box">
                <Link href={`/product/product-details/${item.product.slug}`}>
                  <img
                    src={productPath + item.product.productImage}
                    alt={item.product.productImage}
                    className="max-lg:w-full lg:w-[180px] rounded-lg object-cover"
                  />
                </Link>
              </div>
              <div className="col-span-12 lg:col-span-10 detail w-full lg:pl-3">
                <div className="flex items-center justify-between w-full mb-4">
                  <h5 className="font-manrope font-semibold text-2xl leading-9 text-gray-900">
                    {item.product.productName}
                  </h5>
                  <button onClick={()=>deleteProduct(item._id)} className="rounded-full group flex items-center justify-center focus-within:outline-red-500">
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="fill-red-50 transition-all duration-500 group-hover:fill-red-400"
                        cx="17"
                        cy="17"
                        r="17"
                        fill=""
                      />
                      <path
                        className="stroke-red-500 transition-all duration-500 group-hover:stroke-white"
                        d="M14.1673 13.5997V12.5923C14.1673 11.8968 14.7311 11.333 15.4266 11.333H18.5747C19.2702 11.333 19.834 11.8968 19.834 12.5923V13.5997M19.834 13.5997C19.834 13.5997 14.6534 13.5997 11.334 13.5997C6.90804 13.5998 27.0933 13.5998 22.6673 13.5997C21.5608 13.5997 19.834 13.5997 19.834 13.5997ZM12.4673 13.5997H21.534V18.8886C21.534 20.6695 21.534 21.5599 20.9807 22.1131C20.4275 22.6664 19.5371 22.6664 17.7562 22.6664H16.2451C14.4642 22.6664 13.5738 22.6664 13.0206 22.1131C12.4673 21.5599 12.4673 20.6695 12.4673 18.8886V13.5997Z"
                        stroke="#EF4444"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                    </svg>
                  </button>
                </div>
                <div>
                  <div className="flex items-center text-[18px] font-semibold mb-4">
                    <p>Size : </p>{" "}
                    <div className="ms-2 font-medium">{item.size.sizeName}</div>
                  </div>
                  <div className="flex items-center text-[18px] font-semibold mb-4">
                    <p>Color : </p>{" "}
                    <div className="ms-2 font-medium flex items-center gap-2">
                      <div
                        style={{ backgroundColor: item.color.colorCode }}
                        className="w-2 h-2 rounded-full p-2 border border-black"
                      ></div>{" "}
                      <div>
                      {item.color.colorName}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="font-normal text-base leading-7 text-gray-500 mb-6">
                  {item.product.productShortDesc}{" "}
                  <Link
                    href={`/product/product-details/${item.product.slug}`}
                    className="text-black font-semibold"
                  >
                    More....
                  </Link>
                </p>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <button onClick={() => 
                updateQuantity(item._id, false, item)
              } className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300">
                      <svg
                        className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.5 9.5H13.5"
                          stroke=""
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                    <div className="border border-gray-200 flex items-center justify-center rounded-full w-10 aspect-square outline-none text-gray-900 font-semibold text-[15px] py-1.5 bg-gray-100  text-center">{item.quantity}</div>
                    <button onClick={() => 
                updateQuantity(item._id, true, item)
              } className="group rounded-[50px] border border-gray-200 shadow-sm shadow-transparent p-2.5 flex items-center justify-center bg-white transition-all duration-500 hover:shadow-gray-200 hover:bg-gray-50 hover:border-gray-300 focus-within:outline-gray-300">
                      <svg
                        className="stroke-gray-900 transition-all duration-500 group-hover:stroke-black"
                        width="18"
                        height="19"
                        viewBox="0 0 18 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.75 9.5H14.25M9 14.75V4.25"
                          stroke=""
                          stroke-width="1.6"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <h6 className="text-black font-manrope font-semibold text-2xl leading-9 text-right">
                    ${item.product.productPrice}
                  </h6>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center flex-col mt-[100px] py-[120px]">
            <div className="text-[22px] uppercase font-semibold mb-3">
              Cart is Empty
            </div>
            <Link href={"/collections"}>
              <button className="border-2 mx-auto table py-3 px-4 bg-black hover:bg-white text-white duration-500 hover:text-black hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium rounded-md">
                Add Products
              </button>
            </Link>
          </div>
        )}
        <div className="flex flex-col md:flex-row items-center md:items-center justify-between lg:px-6 pb-6 border-b border-gray-200 max-lg:max-w-lg max-lg:mx-auto">
          <h5 className="text-gray-900 font-manrope font-semibold text-2xl leading-9 w-full max-md:text-center max-md:mb-4">
            Subtotal
          </h5>

          <div className="flex items-center justify-between gap-5 ">
            <button className="rounded-full py-2.5 px-3 bg-indigo-50 text-black font-semibold text-xs text-center whitespace-nowrap transition-all duration-500 hover:bg-indigo-100">
              Promo Code?
            </button>
            <h6 className="font-manrope font-bold text-3xl lead-10 text-black">
              ${totalPrice}
            </h6>
          </div>
        </div>
        <div className="max-lg:max-w-lg max-lg:mx-auto">
          <p className="font-normal text-base leading-7 text-gray-500 text-center mb-5 mt-6">
            Shipping taxes, and discounts calculated at checkout
          </p>
          <div className="flex justify-end items-center gap-5">
            <Link href={"/collections"}>
          <button className="text-black font-semibold underline underline-offset-4">Continue Shopping</button>
            </Link>
          <Link href={"/checkouts"}>
          <button className="rounded-full py-4 px-12 bg-black text-white font-semibold text-lg transition-all duration-500 hover:bg-black hover:opacity-80 ">
            Secure Checkout
          </button>
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
