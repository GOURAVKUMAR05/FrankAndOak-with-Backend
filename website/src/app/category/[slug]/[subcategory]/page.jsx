"use client";
import React, { useEffect, useState } from "react";
import { FaRegSquareFull } from "react-icons/fa6";
import { SiWindows11 } from "react-icons/si";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { Card } from "@/app/common/Card";
import * as Accordion from "@radix-ui/react-accordion";
import axios from "axios";
import { websiteBaseUrl } from "@/app/config/config";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

export default function Collection() {
  let [settingGrid, setSettingGrid] = useState(false);
  let [dropdown,setDropdown]=useState(false)
  let [productData,setProductData]=useState([])
  let [productPath,setProductPath]=useState("")

  let CookieParentId=Cookies.get("parentCat_slug")
  useEffect(()=>{
    axios.get(websiteBaseUrl+`products/filtered-category-view/${CookieParentId}`)
    .then((res)=>{
      if(res.data.status){
        setProductData(res.data.data)
        setProductPath(res.data.path)
      }
    })
    .catch((error)=>{
      toast.error("Server error occurred")
    })
  },[CookieParentId])

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
              {productData.length>0 ?
              productData.map((product,index)=>(
                <Card key={index} product={product} productPath={productPath} />
              ))
            :
            [...Array(20)].map((_, index) => ( 
              <div key={index} className="product-skeleton">
                  <SkeletonTheme baseColor="#ECEAE8" className=""  highlightColor="#fff">
                <Skeleton height={400} className="shadow-lg" width={290} borderRadius={0}  /> 
                </SkeletonTheme>
              </div>
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
  useEffect(()=>{
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
          <Accordion.Root
            className="duration-500 transition-all"
            type="multiple"
            defaultValue="item-1"
            collapsible
          >
            <Accordion.AccordionItem value="item-1">
              <div className="border-t border-gray-300 ">
                <Accordion.AccordionTrigger>
                  <h4 className="text-[14px] font-semibold py-4 ps-2 pe-5 w-full">
                    Sub Category
                  </h4>
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  <div className="space-y-2 pb-3 ps-2">
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        Red
                      </label>
                    </div>
                  </div>
                </Accordion.AccordionContent>
              </div>
            </Accordion.AccordionItem>
            <Accordion.AccordionItem value="item-2">
              <div className="border-t border-gray-300  ">
                <Accordion.AccordionTrigger>
                  <h4 className="text-[14px] font-semibold py-4 ps-2 pe-5">
                    Size
                  </h4>
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  <ul className=" py-1.5 flex flex-wrap items-center gap-x-2 gap-y-1  text-center box-border bg-white text-[14px] font-medium">
                    {sizeData.map((item,index)=>(
                    <li key={index}>
                      <button className="text-sm font-semibold duration-300 text-black bg-white hover:border-gray-400 border px-3.5 py-1 uppercase">
                        {item.sizeName}
                      </button>
                    </li>
                    ))}
                  </ul>
                </Accordion.AccordionContent>
              </div>
            </Accordion.AccordionItem>
            <Accordion.AccordionItem value="item-3">
              <div className="border-t border-gray-300  ">
                <Accordion.AccordionTrigger>
                  <h4 className="text-[14px] font-semibold py-4 ps-2 pe-5">
                    Color
                  </h4>
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  <div className="space-y-2 pb-3 ps-2">
                    {colorData.map((item,index)=>(
                    <div key={index} className="flex items-center gap-2 cursor-pointer">
                      <div style={{background:item.colorCode}} className="w-5 h-5 rounded-full p-2"></div>
                      <div className="text-sm font-medium">{item.colorName}</div>
                    </div>
                    ))}
                  
                  </div>
                </Accordion.AccordionContent>
              </div>
            </Accordion.AccordionItem>
            <Accordion.AccordionItem value="item-4">
              <div className="border-t border-gray-300  ">
                <Accordion.AccordionTrigger>
                  <h4 className="text-[14px] font-semibold py-4 ps-2 pe-5">
                    Price
                  </h4>
                </Accordion.AccordionTrigger>
                <Accordion.AccordionContent>
                  <div className="space-y-2 pb-3 ps-2">
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        $50 - $200
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        $50 - $200
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        $50 - $200
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        $50 - $200
                      </label>
                    </div>
                    <div class="flex items-center me-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-black bg-gray-300 border-black rounded focus:ring-0 checked:bg-black"
                      />

                      <label class="ms-2 text-[14px] font-semibold cursor-pointer">
                        $50 - $200
                      </label>
                    </div>
                  </div>
                </Accordion.AccordionContent>
              </div>
            </Accordion.AccordionItem>
          </Accordion.Root>
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
