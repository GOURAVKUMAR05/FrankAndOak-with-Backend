"use client";

import axios from "axios";
import { useState } from "react";
import { websiteBaseUrl } from "../config/config";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCartStatus } from "../features/cartStatusSlice";
import { fetchCartData } from "../features/cartListSlice";
import { setLoginStatus } from "../features/loginStatusSlice";
import { IoMdHeartDislike } from "react-icons/io";

export function Card({ product, productPath, slugLink, removeWishlistBtn, viewWishlist }) {
  const dispatch = useDispatch();
  let [sizequickAdd, setSizeQuickAdd] = useState(false);
  let [selectedColor, setSelectedColor] = useState("");
  let [wishliststatus,setWishliststatus]=useState(false)


  let user = useSelector((state) => state.userStatus.value);

  let handleAddToCart = (sizeId) => {
    if (!user._id) {
      toast.error("Login to add products in cart.");
      dispatch(setLoginStatus(true));
    } else {
      let cartData = {
        user: user._id,
        product: product._id,
        size: sizeId,
        color: selectedColor,
        quantity: 1,
      };
      // console.log(cartData);
      if (!selectedColor) {
        toast("Please select Product Color also.", {
          icon: "⚠️",
        });
      } else {
        axios
          .post(websiteBaseUrl + "cart/save-cart", cartData)
          .then((res) => {
            if (res.data.status) {
              dispatch(setCartStatus(true));
              dispatch(fetchCartData(user._id));
              toast.success(res.data.message);
            }
          })
          .catch((error) => {
            toast.error(res.data.message);
          });
      }
    }
  };

  let addToWishlist = (productId) => {
    let wishData={
      product:productId,
      user:user._id,
    }
    if (!user._id) {
      toast.error("Login to add product in wishlist.");
      dispatch(setLoginStatus(true));
    } else {
      axios
        .post(websiteBaseUrl + "wishlist/save-wishlist", wishData)
        .then((res) => {
          if (res.data.status) {
            setWishliststatus(true)
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <p className="text-sm font-medium text-gray-900">
                    {res.data.message}
                  </p>
                </div>
                <div className="flex border-l border-gray-200">
                  <Link href={"/user-dashboard/wishlist"}>
                    <button className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ));
          } else {
            toast.custom((t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4">
                  <p className="text-sm font-medium text-gray-900">
                    {res.data.message}
                  </p>
                </div>
                <div className="flex border-l border-gray-200">
                  <Link href={"/user-dashboard/wishlist"}>
                    <button className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ));
          }
        })
        .catch((error) => {
          toast.error("Server error occurred.");
        });
    }
  };

  let removeWishlist=(productId)=>{
    axios.delete(websiteBaseUrl+`wishlist/delete-wishlist/${productId}`)
    .then((res)=>{
      if(res.data.status){
        viewWishlist()
      }
    })
    .catch((error)=>{
      toast.error("Server error occurred.")
    })
  }

  return (
    <div className="cursor-pointer group">
      <div className=" w-full h-full">
        <div className=" relative">
          <span className="bg-black text-white absolute right-2 top-2 z-[9999] text-[8px] sm:text-[10px] font-medium uppercase px-0.5 sm:px-1 py-0.5">
            {(
              ((product.productMRP - product.productPrice) * 100) /
              product.productMRP
            ).toFixed(2)}
            % Off
          </span>
          <Link href={`/product/product-details/${product.slug}`}>
            <img
              className="h-full w-full object-cover"
              src={productPath + product.productImage}
              alt={product.productName}
            />
          </Link>
          <Link href={`/product/product-details/${product.slug}`}>
            <img
              className="h-full w-full duration-300 z-[999] absolute top-0 group-hover:block hidden object-cover"
              src={productPath + product.productAnimationImage}
              alt={product.productName}
            />
          </Link>
          <button
            onMouseEnter={() => setSizeQuickAdd(true)}
            onMouseLeave={() => setSizeQuickAdd(false)}
            className={`${
              sizequickAdd
                ? "group-hover:hidden z-[999]"
                : "group-hover:block z-[999999]"
            } w-[95%] text-center box-border bg-white py-3 text-[14px] font-medium absolute bottom-2 translate-x-[-50%]  left-[50%] hidden`}
          >
            Quick Add
          </button>
          {sizequickAdd ? (
            <SizeSelectionButton
              setSizeQuickAdd={setSizeQuickAdd}
              productSize={product.productSizeId}
              addToCart={(sizeId) => handleAddToCart(sizeId)}
            />
          ) : (
            ""
          )}
        </div>
        <h5 className="sm:text-[14px] text-[12px] flex gap-3 mt-2 font-semibold">
          {product.productName}
          <span className=" rounded-full  hover:bg-[#EBECEE] h-7 w-7 p-1">
            <svg
              onClick={() => {addToWishlist(product._id);}}
              className="sm:w-5 sm:h-5 h-3 w-3 "
              viewBox="0 0 20 20"
              fill={wishliststatus ? "black" : "none"}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.3666 3.84123C16.941 3.4154 16.4356 3.07761 15.8794 2.84714C15.3232 2.61667 14.727 2.49805 14.1249 2.49805C13.5229 2.49805 12.9267 2.61667 12.3705 2.84714C11.8143 3.07761 11.3089 3.4154 10.8833 3.84123L9.99994 4.72457L9.1166 3.84123C8.25686 2.98149 7.0908 2.49849 5.87494 2.49849C4.65907 2.49849 3.49301 2.98149 2.63327 3.84123C1.77353 4.70098 1.29053 5.86704 1.29053 7.0829C1.29053 8.29876 1.77353 9.46482 2.63327 10.3246L3.5166 11.2079L9.99994 17.6912L16.4833 11.2079L17.3666 10.3246C17.7924 9.89894 18.1302 9.39358 18.3607 8.83736C18.5912 8.28115 18.7098 7.68497 18.7098 7.0829C18.7098 6.48083 18.5912 5.88465 18.3607 5.32844C18.1302 4.77222 17.7924 4.26686 17.3666 3.84123Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </span>
        </h5>

        <div className="flex items-center justify-between">
          <div className="flex gap-3">
          <div className="sm:text-[14px] text-[13px] font-medium mt-1 sm:mt-3">
            $ {product.productPrice}
          </div>
          <div className="sm:text-[14px] text-[13px] font-medium mt-1 sm:mt-3 line-through text-gray-400">
            $ {product.productMRP}
          </div>
          </div>
          {removeWishlistBtn ? 
          <button onClick={()=>removeWishlist(product._id)} className="text-[13px] font-medium flex  text-red-600"><IoMdHeartDislike className="sm:w-5 sm:h-5 h-3 w-3 " /> Remove</button>
: ""}
        </div>
        <span className="group-hover:hidden sm:text-[16px] text-[12px] block">
          {product.productColorId.length} colors
        </span>
        <div className="group-hover:flex gap-2 hidden mt-1">
          {product.productColorId.map((item, index) => (
            <div
              onClick={() => setSelectedColor(item._id)}
              key={index}
              style={{ background: item.colorCode }}
              className={`${
                selectedColor == item._id
                  ? "shadow-[0_0_0_2px_white,0_0_0_4px_black]"
                  : ""
              } sm:w-4 sm:h-4 h-3 w-3 rounded-full border border-black flex items-center justify-center`}
            ></div>
          ))}
        </div>
      </div>
    </div>
    // <div></div>
  );
}

function SizeSelectionButton({ setSizeQuickAdd, productSize, addToCart }) {
  return (
    <ul
      onMouseEnter={() => setSizeQuickAdd(true)}
      onMouseLeave={() => setSizeQuickAdd(false)}
      className="w-[95%] py-1.5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1  text-center box-border bg-white text-[14px] font-medium absolute bottom-2 translate-x-[-50%]  z-[9999] left-[50%]"
    >
      {productSize.length > 0 ? (
        productSize.map((size, index) => (
          <li key={index}>
            <button
              onClick={() => addToCart(size._id)}
              value={size._id}
              className="text-sm font-semibold duration-300 text-black hover:text-white bg-white hover:bg-black px-5 py-2  uppercase"
            >
              {size.sizeName}
            </button>
          </li>
        ))
      ) : (
        <li>
          <button className="text-sm font-semibold duration-300 text-black hover:text-white bg-white hover:bg-black px-5 py-2  ">
            Free Size
          </button>
        </li>
      )}
    </ul>
  );
}
