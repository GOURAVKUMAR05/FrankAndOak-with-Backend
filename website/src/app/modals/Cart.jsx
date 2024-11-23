"use client";
import { BsArrowLeft } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { setCartStatus } from "../features/cartStatusSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { websiteBaseUrl } from "../config/config";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { fetchCartData } from "../features/cartListSlice";
export default function Cart() {
  let dispatch = useDispatch();
  const cartStatus = useSelector((state) => state.cartStatus.value);
  // let user=Cookies.get("frank_Oak_User") ? JSON.parse(Cookies.get("frank_Oak_User")) : {}
  let user = useSelector((state) => state.userStatus.value);
  let [viewcartData, setViewCartData] = useState([]);
  let [productPath, setProductPath] = useState("");
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

  const totalPrice = viewcartData
  .reduce((acc, item) => {
    return acc + item.product.productPrice * item.quantity;
  }, 0)
  .toFixed(2);

  return (
    <>
      <div
        onClick={() => dispatch(setCartStatus(false))}
        className={`bg-black ${
          cartStatus ? "block" : "hidden"
        } fixed top-0 left-0 opacity-50 z-[99999] w-full min-h-screen`}
      ></div>
      <section
        className={`${
          cartStatus ? "opacity-100 visible" : "opacity-0 invisible"
        } duration-500`}
      >
        <div className="lg:w-[38%] w-full  fixed top-0 right-0 z-[999999] bg-white">
          <div
            onClick={() => dispatch(setCartStatus(false))}
            className="py-3 px-6 flex items-center gap-2 bg-[#F9F9F9] cursor-pointer"
          >
            <BsArrowLeft className="font-bold" />
            <div className="text-sm font-semibold">Contine Shopping</div>
          </div>
          <div className=" bg-black text-white text-[12px] text-center font-bold py-1.5">
            Free shipping on orders $99+ and free returns
          </div>
          <div className="md:px-8 px-4 lg:h-screen h-full overflow-y-scroll pb-[200px] ">
            {viewcartData.length > 0 ? (
              viewcartData.map((item, index) => (
                <CartProducts
                  key={index}
                  productData={item}
                  productPath={productPath}
                />
              ))
            ) : (
              <div className="flex items-center justify-center flex-col mt-[100px]">
                <div className="text-[22px] uppercase font-semibold mb-3">
                  Cart is Empty
                </div>
                <Link href={"/collections"}>
                  <button
                    onClick={() => dispatch(setCartStatus(false))}
                    className="border-2 mx-auto table py-3 px-4 bg-black hover:bg-white text-white duration-500 hover:text-black hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium rounded-md"
                  >
                    Add Products
                  </button>
                </Link>
              </div>
            )}
          </div>
          <div className="sticky bottom-0 px-8 bg-[#f9f9f9] py-4">
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-semibold">
                Subtotal{" "}
                <span className="text-[14px] font-semibold text-customGray">
                  ({viewcartData.length} items)
                </span>
              </div>
              <div className="text-[18px] font-semibold">${totalPrice}</div>
            </div>
            <Link href="/checkouts">
              <button className="text-[20px] hover:shadow-[5px_5px_0px_0px_#DDD] font-semibold flex justify-center items-center gap-2 text-white bg-black p-3 w-full mt-5">
                Secure Checkout <IoLockClosedOutline size={20} />
              </button>
            </Link>
          </div>
          <div></div>
        </div>
      </section>
    </>
  );
}

function CartProducts({ productData, productPath }) {
  let user = useSelector((state) => state.userStatus.value);
  let dispatch=useDispatch()
  let updateQuantity = (cartId, status) => {
    let productQty = status
      ? productData.quantity + 1
      : productData.quantity - 1;

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
    <div className="grid grid-cols-[25%_auto] gap-3 py-5 border-b border-customBorder">
      <img
        className="w-full"
        src={productPath + productData.product.productImage}
        alt={productData.product.productName}
      />
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h5 className="text-sm font-semibold">
              {productData.product.productName}
            </h5>
            <MdClose className="cursor-pointer" onClick={()=>deleteProduct(productData._id)} size={20} />
          </div>
          <div className="font-semibold text-[12px] text-customGray">
            Size: {productData.size.sizeName}
          </div>
          <div className="font-semibold text-[12px] text-customGray flex items-center gap-1">
            Color:{" "}
            <div
              className="w-2.5 h-2.5 rounded-full p-1.5"
              style={{ backgroundColor: productData.color.colorCode }}
            ></div>{" "}
            {productData.color.colorName}
          </div>
          <div className="text-[12px] mt-1.5 text-customGray font-medium flex items-center gap-1 underline underline-offset-2">
            Move to Wishlist <CiHeart size={16} />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="">
            <button
              onClick={() => 
                updateQuantity(productData._id, false)
              }
              className="px-2.5 py-0.5 text--[20px] border border-customBorder"
            >
              -
            </button>
            <button className="px-2.5 py-0.5 border border-customBorder">
              {productData.quantity}
            </button>
            <button
              onClick={() => 
                updateQuantity(productData._id, true)
              }
              className="px-2.5 py-0.5 text--[20px] border border-customBorder"
            >
              +
            </button>
          </div>
          <div className="text-[15px] font-semibold">
            ${productData.product.productPrice}
          </div>
        </div>
      </div>
    </div>
  );
}
