"use client";
import React, { useEffect, useState } from "react";
import { FaRegSquareFull } from "react-icons/fa6";
import { SiWindows11 } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { Card } from "@/app/common/Card";
import { Accordion } from "@radix-ui/react-accordion";
import axios from "axios";
import { websiteBaseUrl } from "@/app/config/config";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productListSlice";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";


export default function Collection() {
  let [settingGrid, setSettingGrid] = useState(false);
  let [dropdown,setDropdown]=useState(false)
  let [productList,setProductList]=useState([])
  let [productPath,setProductPath]=useState("")
  const dispatch=useDispatch()
  let productObject=useSelector((state)=>state.productList.value)
  let loading=useSelector((state)=>state.productList.loading)
  let error=useSelector((state)=>state.productList.error)

  useEffect(()=>{
    dispatch(fetchProducts())
  },[dispatch])
  

  useEffect(()=>{
    if(productObject.data!==undefined){
    setProductList(productObject.data)
    setProductPath(productObject.path)
    }
  },[productObject])

  //  useEffect(()=>{
  //    axios.get(websiteBaseUrl+"products/active-products")
  //      .then((res)=>{
  //        if(res.data.status){
  //          setProductList(res.data.data)
  //          setProductPath(res.data.path)
  //        }
  //      })
  //      .catch((error)=>{
  //        console.log("Error in Product List: ",error)
  //      })
  //  },[])
  return (
    <>
      <section className="grid lg:grid-cols-[17%_83%] md:grid-cols-[25%_75%] justify-between mt-[50px] md:px-5 px-0 pt-14">
        <CategorySidebar />
        <div className="sticky top-0 p-4 h-screen overflow-y-scroll catListScroll">
          <div className="w-full border-b border-gray-300 py-6 flex items-center md:justify-end justify-between">
            <div className="text-[14px] font-semibold flex gap-2 md:hidden ">
              <svg
                className="w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <path d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z" />
              </svg>{" "}
              Filters
            </div>
            <div className="flex gap-2 justify-end">
              <SiWindows11
                onClick={() => setSettingGrid(false)}
                className="text-white cursor-pointer bg-black border-2 hover:border-[#BFBFBF] hover:bg-[#BFBFBF] border-black w-6 h-6"
              />
              <FaRegSquareFull
                onClick={() => setSettingGrid(true)}
                className="w-6 h-6 cursor-pointer text-gray-500 hover:text-[#BFBFBF]"
              />
              <div onClick={()=>setDropdown(!dropdown)} className="relative cursor-pointer flex items-center text-[14px] font-semibold gap-2 ms-5">
                Sort by {dropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                <div id="dropdown" class={`absolute top-6 left-[-100px] z-[99999999] ${dropdown ? "block" : "hidden"} bg-white divide-y divide-gray-100 rounded-lg shadow w-44`}>
    <ul class="py-2 text-sm text-gray-700 " aria-labelledby="dropdownDefaultButton">
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Featured</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Best Selling</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Price, low to high</a>
      </li>
      <li>
        <a href="#" class="block px-4 py-2 hover:bg-gray-100">Price, high to low</a>
      </li>
    </ul>
</div> 
              </div>

              
            </div>
          </div>
          <div className="py-6">
            <div className="text-[20px] pb-5 font-medium">New In</div>
            <div
              className={`grid ${
                settingGrid
                  ? "lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3"
                  : "lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-5"
              } duration-300`}
            >
               { loading ?
               [...Array(20)].map((_, index) => ( 
                <div key={index} className="product-skeleton">
                    <SkeletonTheme baseColor="#ECEAE8" className=""  highlightColor="#fff">
                  <Skeleton height={400} className="shadow-lg" width={290} borderRadius={0}  /> 
                  </SkeletonTheme>
                </div>
              ))
               :
                 productList.map((product,index)=>(
                 <Card key={index} product={product} productPath={productPath} slugLink={product.slug} />
               ))
           }
            </div>
            <div className="text-center mt-10">
              <span className="text-[14px] font-mediumtext-[#666] block">
                40 of 99
              </span>
              <button className="border-2 py-2.5 px-16 hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium mt-2">
                Load more
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export function CategorySidebar() {
  let [colorData,setColorData]=useState([])
  let [sizeData,setSizeData]=useState([])
  let [subCatData,setSubCatData]=useState([])

  const [expanded, setExpanded] = useState(null);

  const toggleAccordion = (item) => {
    setExpanded(expanded === item ? null : item); // Toggle the current item
  };

  useEffect(()=>{
    axios.get(websiteBaseUrl+"collections/subcategory-view")
    .then((res)=>{
      if(res.data.status){
        setSubCatData(res.data.data)
      }
    })
    axios.get(websiteBaseUrl+"collections/color-view")
    .then((res)=>{
      if(res.data.status){
        setColorData(res.data.dataList)
      }
    })

    axios.get(websiteBaseUrl+"collections/size-view")
    .then((res)=>{
      if(res.data.status){
        setSizeData(res.data.dataList)
      }
    })
  },[])
  return (
    <aside className="h-screen md:block hidden">
      <div className="text-[13px] font-medium">
        {" "}
        <span className="underline underline-offset-2">Home</span> /{" "}
        <span className="underline underline-offset-2">Women</span>
      </div>
      <div className="text-[20px] pt-2 font-medium">New In</div>
      <div
        id="asideScrollBar"
        className="h-[90vh] pe-2 overflow-scroll overflow-x-hidden"
      >
        <div className="pt-7 divide-y  divide-gray-300">
          <div className="accordion">
      {/* Sub Category Accordion */}
      <div className="accordion-item border-t border-gray-300">
        <div
          className="accordion-trigger cursor-pointer py-4 px-5 hover:bg-gray-100 transition duration-300"
          onClick={() => toggleAccordion('sub-category')}
        >
          <h4 className="text-sm font-semibold text-gray-800">Sub Category</h4>
        </div>
        {expanded === 'sub-category' && (
          <div className="accordion-content space-y-2 pb-3 px-5">
            {subCatData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-black bg-gray-300 border-gray-300 rounded focus:ring-0 checked:bg-black"
                />
                <label className="text-sm font-semibold text-gray-700">{item.subCategoryName}</label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Size Accordion */}
      <div className="accordion-item border-t border-gray-300">
        <div
          className="accordion-trigger cursor-pointer py-4 px-5 hover:bg-gray-100 transition duration-300"
          onClick={() => toggleAccordion('size')}
        >
          <h4 className="text-sm font-semibold text-gray-800">Size</h4>
        </div>
        {expanded === 'size' && (
          <div className="accordion-content py-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-center">
            {sizeData.map((item, index) => (
              <button
                key={index}
                className="text-sm font-semibold text-black bg-white border px-4 py-2 rounded hover:bg-gray-200 focus:outline-none"
              >
                {item.sizeName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Accordion */}
      <div className="accordion-item border-t border-gray-300">
        <div
          className="accordion-trigger cursor-pointer py-4 px-5 hover:bg-gray-100 transition duration-300"
          onClick={() => toggleAccordion('color')}
        >
          <h4 className="text-sm font-semibold text-gray-800">Color</h4>
        </div>
        {expanded === 'color' && (
          <div className="accordion-content space-y-2 pb-3 px-5">
            {colorData.map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  style={{ backgroundColor: item.colorCode }}
                  className="w-5 h-5 rounded-full border border-gray-300"
                ></div>
                <span className="text-sm font-semibold text-gray-700">{item.colorName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price Accordion */}
      <div className="accordion-item border-t border-gray-300">
        <div
          className="accordion-trigger cursor-pointer py-4 px-5 hover:bg-gray-100 transition duration-300"
          onClick={() => toggleAccordion('price')}
        >
          <h4 className="text-sm font-semibold text-gray-800">Price</h4>
        </div>
        {expanded === 'price' && (
          <div className="accordion-content space-y-2 pb-3 px-5">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-black bg-gray-300 border-gray-300 rounded focus:ring-0 checked:bg-black"
                />
                <label className="text-sm font-semibold text-gray-700">Price Range {index + 1}</label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
        </div>
        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-[14px] font-bold">Featured</h3>
          <ul className="py-4 text-[13px] font-semibold space-y-2">
            <li>New In</li>
            <li>Best Sellers</li>
            <li>Coming Soon</li>
            <li>The Originals</li>
            <li>Workwear</li>
            <li>Sale</li>
          </ul>
          <h3 className="text-[14px] font-bold mt-5">Clothing</h3>
          <ul className="py-4 text-[13px] font-semibold space-y-2">
            <li>Shop All</li>
            <li>T-shirts & Tops</li>
            <li>Blouses & Shirts</li>
            <li>Sweaters & Cardigans</li>
            <li>Blazers & Overshirts</li>
            <li>Sale</li>
            <li>Denim</li>
            <li>Pants</li>
            <li>Dresses</li>
          </ul>
          <h3 className="text-[14px] font-bold mt-5">Accessories</h3>
          <ul className="pt-4 text-[13px] font-semibold space-y-2">
            <li>Shop All</li>
            <li>T-shirts & Tops</li>
            <li>Blouses & Shirts</li>
            <li>Sweaters & Cardigans</li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
