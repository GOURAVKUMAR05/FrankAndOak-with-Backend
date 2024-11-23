"use client";
import YouMightAlsoLiked from "@/app/common/YouMightAlsoLiked";
import ProductReview from "@/app/HomeComponents/ProductReview";
import React, { useEffect, useState } from "react";
import ProductReviews from "../ProductComponents/ProductReviews";
import { usePathname } from "next/navigation";
import axios from "axios";
import { websiteBaseUrl } from "@/app/config/config";
import toast from "react-hot-toast";
import * as Accordion from "@radix-ui/react-accordion";
import { setCartStatus } from "@/app/features/cartStatusSlice";
import { fetchCartData } from "@/app/features/cartListSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProductDetails() {
  let dispatch = useDispatch();
  let [productDetail, setProductDetail] = useState({});
  let [productDetailPath, setProductDetailPath] = useState("");
  let [selectedColor, setSelectedColor] = useState("");
  let [selectedSize, setSelectedSize] = useState("");
  let user = useSelector((state) => state.userStatus.value);

  const pathName = usePathname();
  let slug = pathName.split("/").pop();
  console.log(productDetail);
  useEffect(() => {
    axios
      .get(websiteBaseUrl + `products/product-detail/${slug}`)
      .then((res) => {
        if (res.data.status) {
          setProductDetail(res.data.data);
          setProductDetailPath(res.data.path);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("Server error occurred.");
      });
  }, [slug]);

  let handleAddToCart = (event) => {
    event.preventDefault();
    if (!user) {
      toast.error("Please Login!");
    }
    let cartData = {
      user: user._id,
      product: productDetail._id,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    };
    console.log(cartData);
    if (!selectedColor) {
      toast("Please select Product Color also.", {
        icon: "⚠️",
      });
    }
    if (!selectedSize) {
      toast("Please select Product Size also.", {
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
  };
  return (
    <>
      {productDetail !== null ? (
        <section className="pt-12 w-full grid lg:grid-cols-[60%_38%] md:grid-cols-[40%_60%] grid-cols-1 justify-between items-start mt-[50px] p-2 ">
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-3">
            {productDetail.productGallery ? (
              productDetail.productGallery.map((image, index) => (
                <img
                  key={index}
                  className="w-full h-full object-cover"
                  src={productDetailPath + image}
                  alt={productDetail.productName}
                />
              ))
            ) : (
              <>
                <div className="w-full h-[600px] bg-black opacity-30"></div>
                <div className="w-full h-[600px] bg-black opacity-30"></div>
                <div className="w-full h-[600px] bg-black opacity-30"></div>
                <div className="w-full h-[600px] bg-black opacity-30"></div>
              </>
            )}
          </div>
          <div className="p-10">
            <div className="text-[13px] font-medium">
              {" "}
              <span className="underline underline-offset-2">Home</span> /{" "}
              <span className="underline underline-offset-2">
                {productDetail.productParentCategoryId?.categoryName}
              </span>{" "}
              /{" "}
              <span className="underline underline-offset-2 cursor-default">
                {productDetail.productName ? (
                  productDetail.productName
                ) : (
                  <span className="underline underline-offset-2">......</span>
                )}
              </span>
            </div>
            <div className="py-5">
              <span className="bg-black text-white text-[10px] font-medium uppercase p-1">
                new
              </span>
              <h3 className="text-[24px] font-semibold mt-3 mb-5">
                {productDetail.productName ? (
                  productDetail.productName
                ) : (
                  <div className="text-[14px] font-semibold py-5 rounded-sm w-full bg-black opacity-20"></div>
                )}
              </h3>
              <div className="">
                <div className="flex items-center gap-3">
                  <div className="text-[22px] font-semibold mb-2">
                    ${" "}
                    {productDetail.productPrice
                      ? productDetail.productPrice
                      : "00"}
                  </div>
                  <div className="text-[16px] font-medium mb-2 line-through text-red-500">
                    ${" "}
                    {productDetail.productMRP ? productDetail.productMRP : "00"}
                  </div>
                </div>
                <div className="text-[16px] font-bold my-1.5 ms-1  text-red-500">
                  {productDetail.productMRP || productDetail.productPrice
                    ? (
                        ((productDetail.productMRP -
                          productDetail.productPrice) *
                          100) /
                        productDetail.productPrice
                      ).toFixed(2)
                    : "0"}
                  % Off
                </div>
              </div>
              <p className="text-[13px] font-medium">
                {productDetail.productShortDesc}
                {/* 4 interest-free payments of $24.87 with <b>Klarna</b>.{" "}
            <u>Learn More</u>{" "} */}
              </p>
            </div>
            <div className="py-8 border-y border-gray-300">
              <div className="text-[14px] font-semibold mb-4">Color</div>
              <div className="space-x-3 flex">
                {productDetail.productColorId ? (
                  productDetail.productColorId.map((color, index) => (
                    <div
                      onClick={() => setSelectedColor(color._id)}
                      style={{ backgroundColor: color.colorCode }}
                      key={index}
                      className={`${
                        selectedColor == color._id
                          ? "shadow-[0_0_0_2px_white,0_0_0_4px_black]"
                          : ""
                      } text-[14px] cursor-pointer font-semibold w-6 h-6 rounded-full`}
                    ></div>
                  ))
                ) : (
                  <div className="text-[14px] font-semibold py-5 rounded-sm w-full bg-black opacity-20"></div>
                )}
              </div>
            </div>
            <div className="py-8 border-y border-gray-300">
              <div className="text-[14px] font-semibold mb-4">
                Select a size
              </div>
              <div className="space-x-2">
                {productDetail.productSizeId ? (
                  productDetail.productSizeId.map((size, index) => (
                    <button
                      onClick={() => setSelectedSize(size._id)}
                      value={size._id}
                      key={index}
                      className={`${
                        selectedSize == size._id
                          ? "border-black bg-black hover:border-black text-white"
                          : ""
                      } text-[16px] font-semibold py-2 px-5 border border-gray-300 hover:border-gray-600 uppercase`}
                    >
                      {size.sizeName}
                    </button>
                  ))
                ) : (
                  <div className="text-[14px] font-semibold py-5 rounded-sm w-full bg-black opacity-20"></div>
                )}
              </div>
            </div>
            <div className="py-6 border-b border-gray-300">
              <div className="grid grid-cols-[78%_13%] gap-3 relative ">
                {/* <div className="hover:bg-[rgba(231,229,227,0.3)] w-[93%] h-full absolute top-0 left-0"></div> */}
                <button
                  onClick={handleAddToCart}
                  className="bg-black text-[16px] font-semibold text-white py-5 px-10 w-full"
                >
                  Add to cart
                </button>
                <button className="py-5 border-2 border-black ">
                  <svg
                    className="mx-auto"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
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
                </button>
              </div>
            </div>
            <div className="flex gap-5 py-6 border-b border-gray-300">
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.shopify.com/s/files/1/0553/7100/6130/files/Shipping-black-2.svg?v=1631729974"
                  alt=""
                />
                <p className="text-[13px] font-medium">
                  Free Shipping over $99
                </p>
              </div>
              <div className="flex items-center gap-2">
                <img
                  src="https://cdn.shopify.com/s/files/1/0553/7100/6130/files/Returns-black.svg?v=1676483365"
                  alt=""
                />
                <p className="text-[13px] font-medium">Free Returns</p>
              </div>
            </div>
            <div className="py-6 border-b border-gray-30">
              <h5 className="text-[18px] font-semibold mb-5">Overview</h5>
              <p className="text-[14px] font-medium mb-4">
                {productDetail.productDescription ? (
                  productDetail.productDescription
                ) : (
                  <div className="text-[14px] font-semibold py-16 rounded-sm w-full bg-black opacity-20"></div>
                )}
              </p>
            </div>
            <div>
              <Accordion.Root
                className="duration-500 transition-all"
                type="multiple"
                defaultValue="item-1"
                collapsible
              >
                <Accordion.AccordionItem value="item-1">
                  <div className="border-b border-gray-30">
                    <Accordion.AccordionTrigger>
                      <h4 className=" py-6 text-[16px] font-medium flex items-center justify-between">
                        Features
                      </h4>
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                      <div className="font-semibold text-[14px]">
                        Sustainable Materials
                        <ul className="py-3 space-y-2">
                          <li className="flex items-center gap-2">
                            <img
                              src="https://www.frankandoak.com/cdn/shop/files/icon-recycled_polyester.svg"
                              className="w-8 h-8"
                              alt="Tencel"
                            />
                            <p className="text-[14px] font-medium underline underline-offset-2">
                              Recycled Polyester
                            </p>
                          </li>
                          <li className="flex items-center gap-2">
                            <img
                              src="https://www.frankandoak.com/cdn/shop/files/icon-organic_cotton.svg"
                              className="w-8 h-8"
                              alt="Tencel"
                            />
                            <p className="text-[14px] font-medium underline underline-offset-2">
                              Organic Cotton
                            </p>
                          </li>
                          <li className="flex items-center gap-2">
                            <img
                              src="https://www.frankandoak.com/cdn/shop/files/icon-recycled_lining.svg"
                              className="w-8 h-8"
                              alt="Tencel"
                            />
                            <p className="text-[14px] font-medium underline underline-offset-2">
                              Recycled Lining
                            </p>
                          </li>
                        </ul>
                      </div>
                    </Accordion.AccordionContent>
                  </div>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value="item-2">
                  <div className="border-b border-gray-30">
                    <Accordion.AccordionTrigger>
                      <h4 className=" py-6 text-[16px] font-medium flex items-center justify-between">
                        Material & Care
                      </h4>
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                      <div className="font-semibold text-[12px] space-y-5">
                        <div>Materials</div>
                        <div>100% Recycled polyester</div>
                        <div>Care Instructions</div>
                        <ul>
                          <li>Machine wash cold delicate cycle</li>
                          <li>Do not tumble dry</li>
                          <li>Hang to dry</li>
                          <li>Iron low heat</li>
                          <li>Do not bleach</li>
                        </ul>

                        <ul className="flex items-center gap-2">
                          <li>
                            <img
                              className="w-6"
                              src="https://www.frankandoak.com/cdn/shop/files/icon-do_not_tumble_dry.svg"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              className="w-6"
                              src="https://www.frankandoak.com/cdn/shop/files/icon-hang_to_dry.svg"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              className="w-6"
                              src="https://www.frankandoak.com/cdn/shop/files/icon-iron_low_heat.svg"
                              alt=""
                            />
                          </li>
                          <li>
                            <img
                              className="w-6"
                              src="https://www.frankandoak.com/cdn/shop/files/icon-do_not_bleach.svg"
                              alt=""
                            />
                          </li>
                        </ul>
                      </div>
                    </Accordion.AccordionContent>
                  </div>
                </Accordion.AccordionItem>
                <Accordion.AccordionItem value="item-3">
                  <div className="border-b border-gray-30">
                    <Accordion.AccordionTrigger>
                      <h4 className=" py-6 text-[16px] font-medium flex items-center justify-between">
                        Shipping & Returns
                      </h4>
                    </Accordion.AccordionTrigger>
                    <Accordion.AccordionContent>
                      <div className="font-semibold space-y-5 text-[12px]">
                        <div>Free and Easy Returns</div>
                        <p>
                          You have 15 days from the date your order is shipped
                          to request a prepaid return
                        </p>
                        <p>
                          shipping label online. Visit our FAQ for our full
                          return policy.
                        </p>
                        <div>Online orders take 2 to 3 days to fulfill</div>
                        <p>
                          Free standard shipping offer is valid on orders placed
                          on http://frankandoak.com and
                          http://ca.frankandoak.com with a minimum purchase
                          value of $99 after discounts and before taxes or any
                          other associated fees are applied. Offer cannot be
                          applied to past purchases. Additional restrictions may
                          apply.{" "}
                        </p>
                        <p>
                          Visit our Orders & Shipping FAQ for more information
                          on shipping rates and delivery times.{" "}
                        </p>
                        <p>International Addresses</p>
                        <p>
                          Note: International shipping, outside of the US and
                          Canada, is temporarily unavailable. We look forward to
                          shipping around the world again soon!
                        </p>
                      </div>
                    </Accordion.AccordionContent>
                  </div>
                </Accordion.AccordionItem>
              </Accordion.Root>
            </div>
          </div>
        </section>
      ) : (
        <div className="h-[90vh] w-full relative bg-gray-400 opacity-50 flex items-center justify-center">
          <div class="flex-col gap-4 w-full flex items-center justify-center">
            <div class="w-20 h-20 border-4 border-transparent text-blacktext-4xl animate-spin flex items-center justify-center border-t-black rounded-full">
              <div class="w-16 h-16 border-4 border-transparent text-black text-2xl animate-spin flex items-center justify-center border-t-black rounded-full"></div>
            </div>
          </div>
        </div>
      )}
      {/* <YouMightAlsoLiked heading={"You might also like"}/>
    <YouMightAlsoLiked heading={"Recently Viewed"}/> */}
      <ProductReviews />
    </>
  );
}
