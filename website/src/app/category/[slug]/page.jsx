"use client";
import { Card } from "@/app/common/Card";
import { websiteBaseUrl } from "@/app/config/config";
import { BannerFeatures } from "@/app/HomeComponents/Banner";
import BetterLiving from "@/app/HomeComponents/BetterLiving";
import ThisJustIn from "@/app/HomeComponents/ThisJustIn";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Slider from "react-slick";

export default function SubCategory() {
  let [parentCatData, setParentCatData] = useState(null);
  let [subCatData, setSubCatData] = useState([]);
  let [parentCatPath, setParentCatPath] = useState("");
  let [subCatPath, setSubCatPath] = useState("");
  let { slug } = useParams();
  console.log(parentCatData)
  useEffect(() => {
    if (slug !== undefined) {
      axios
        .get(websiteBaseUrl + `collections/sub-category/${slug}`)
        .then((res) => {
          setParentCatData(res.data.parentCategoryData); // we will run it in hero section
          setSubCatData(res.data.subCategoryData); // we will run it in featured category
          setParentCatPath(res.data.parentCatPath);
          setSubCatPath(res.data.subCatPath);
        });
    }
  }, [slug]);

  if(parentCatData){
    Cookies.set("parentCat_slug",parentCatData._id)
  }

  return (
    <>
    <section className="w-full mt-10">
      {parentCatData ? (
        <div className="h-full  relative">
          <img
            className="md:block hidden w-full h-full"
            src={parentCatPath + parentCatData.categoryImage}
            alt={parentCatData.categoryName}
          />
          <img
            className="md:hidden mt-10 block w-full h-full"
            src="/images/BannerMobile.webp"
            alt="Banner"
          />
          <div className="absolute z-[9999] top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] text-center">
            <h2 className="text-[44px] md:text-[78px] tracking-tighter font-semibold leading-tight  text-white">
              {parentCatData.categoryName}
            </h2>
            <div className="md:space-x-7 space-y-5 mt-6">
            <Link href={`/category/${slug}/featured-products`}>
              <button className="py-3 md:inline block px-12 md:px-14 text-black shadow-lg bg-white text-[18px] font-normal">
                Shop Now
              </button>
              </Link>
            </div>
          </div>
          <BannerFeatures />
        </div>
      ) : (
        <div className="h-[90vh] w-full relative bg-gray-400 opacity-50 flex items-center justify-center">
          <div class="flex-col gap-4 w-full flex items-center justify-center">
            <div class="w-20 h-20 border-4 border-transparent text-blacktext-4xl animate-spin flex items-center justify-center border-t-black rounded-full">
              <div class="w-16 h-16 border-4 border-transparent text-black text-2xl animate-spin flex items-center justify-center border-t-black rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </section>
    <section className='max-w-[1460px] mx-auto py-[50px]'>
    <h3 className='md:text-[32px] text-[22px] font-medium'>Featured Categories</h3>
    <div className='grid md:grid-cols-4 grid-cols-2 md:space-y-0 xs:space-y-8 space-y-12 py-[50px] md:gap-5 gap-3'>
        {subCatData.map((item,index)=>{
            return  <div key={index} className='cursor-pointer '>
              <Link href={`/category/${slug}/${item.slug}`}>
            <div className=' w-full h-full'>
                <img className='w-full h-full object-cover' src={subCatPath+item.subCategoryImage} alt={item.subCategoryName} />
            <h5 className='text-[15px] mt-2 font-semibold'>{item.subCategoryName}</h5>
            </div>
            </Link>
        </div>
        })}
    </div>
</section>
{/* <section className='max-w-[1460px] mx-auto py-[50px]'>
        <h3 className='md:text-[32px] text-[22px] font-medium'>This Just In</h3>
        <div className='grid md:grid-cols-4 grid-cols-2 py-[50px] md:gap-5 gap-3'>
            <Card/>
            <Card/>
            <Card/>
            <Card/>
        </div>
    </section> */}
    <FilteredSlider />
    <section className='bg-[#F9F9F9] w-full py-[50px]'>
        <h3 className='md:text-[32px] text-[22px] text-center font-medium'>You didn&apos;t hear it from us</h3>
        <div className='py-[50px] max-w-[1460px] mx-auto grid sm:grid-cols-2 grid-cols-1 gap-10'>
        <div className='grid lg:grid-cols-2 grid-cols-1'>
            <div className='lg:order-1 order-2 lg:px-12 lg:pt-28 p-5 bg-white'>
              <div className='flex items-start lg:flex-row flex-col flex-wrap lg:gap-3'>
              <span className='flex gap-1 basis-[50px]'>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              </span>
              <span className='text-[12px] basis-[50%] font-medium text-[#666]'>Based on 29 reviews</span>
              </div>
              <p className='lg:text-[18px] sm:text-[16px] text-[14px] lg:my-8 my-4 font-medium'>This is a simple vest but it looks expensive and falls nicely on the body! Soft and simple.</p>
              <div className='text-[14px] lg:text-[16px] font-medium text-[#666]'>Emily H.</div>
              <div className='lg:text-[20px] text-[16px] lg:mt-16 my-2 font-medium underline underline-offset-8'>Shop now</div>
            </div>
            <div className='lg:order-2 order-1'>
                <img className='w-full h-full object-cover' src="https://www.frankandoak.com/cdn/shop/files/2120478-2KU.01.jpg?crop=center&height=880&v=1722282342&width=672" alt="" />
            </div>
        </div>
        <div className='grid lg:grid-cols-2 grid-cols-1'>
            <div className='lg:order-1 order-2 lg:px-12 lg:pt-28 p-5 bg-white'>
              <div className='flex items-start lg:flex-row flex-col flex-wrap lg:gap-3'>
              <span className='flex gap-1 basis-[50px]'>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              <svg className='w-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/></svg>
              </span>
              <span className='text-[12px] basis-[50%] font-medium text-[#666]'>Based on 29 reviews</span>
              </div>
              <p className='lg:text-[18px] sm:text-[16px] text-[14px] lg:my-8 my-4 font-medium'>This is a simple vest but it looks expensive and falls nicely on the body! Soft and simple.</p>
              <div className='text-[14px] lg:text-[16px] font-medium text-[#666]'>Emily H.</div>
              <div className='lg:text-[20px] text-[16px] lg:mt-16 my-2 font-medium underline underline-offset-8'>Shop now</div>
            </div>
            <div className='lg:order-2 order-1'>
                <img className='w-full h-full object-cover' src="https://www.frankandoak.com/cdn/shop/files/2210532-4HB.01_1.jpg?crop=center&height=880&v=1723646480&width=672" alt="" />
            </div>
        </div>
        </div>
    </section>
    <BetterLiving/>
</>
  );
}

function FilteredSlider() {
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
  
  const NextArrow = ({ onClick }) => {
    return (
      <div
        className="custom-next-arrow"
        onClick={onClick}
        style={{
          position: "absolute",
          right: "10px",
          top: "45%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 1,
          backgroundColor: "white",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          padding: "20px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        →
      </div>
    );
  };

  // Custom Previous Arrow
  const PrevArrow = ({ onClick }) => {
    return (
      <div
        className="custom-prev-arrow"
        onClick={onClick}
        style={{
          position: "absolute",
          left: "10px",
          top: "45%",
          transform: "translateY(-50%)",
          cursor: "pointer",
          zIndex: 1,
          backgroundColor: "white",
          borderRadius: "50%",
          width: "10px",
          height: "10px",
          padding: "20px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ←
      </div>
    );
  };

  const settings = {
    dots: false,
    autoplay: true,
    autoplaySpeed: 1500,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section className="max-w-[1460px] mx-auto py-[50px]">
      <h3 className="md:text-[32px] text-[22px] font-medium">This Just In</h3>
      {/* <div className='grid md:grid-cols-4 grid-cols-2 py-[50px] md:gap-5 gap-3'> */}
      <div className="py-[50px]">
        <Slider {...settings}>
          {productData.length > 0
            ? 
             productData.map((product, index) => (
                <div key={index} className="px-2">
                  <Card
                    key={index}
                    product={product}
                    productPath={productPath}
                    slugLink={product.slug}
                  />
                </div>
              ))
            :
            [...Array(4)].map((_, index) => (
              <div key={index} className="product-skeleton">
                <SkeletonTheme
                  baseColor="#ECEAE8"
                  className=""
                  highlightColor="#fff"
                >
                  <Skeleton
                    height={450}
                    className="shadow-lg"
                    width={330}
                    borderRadius={0}
                  />
                </SkeletonTheme>
              </div>
            ))
            }
        </Slider>
      </div>
      {/* </div> */}
    </section>
  )
}
