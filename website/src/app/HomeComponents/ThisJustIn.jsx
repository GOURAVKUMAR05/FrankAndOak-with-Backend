"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../common/Card";
import { fetchProducts } from "../features/productListSlice";
import { useDispatch, useSelector } from "react-redux";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import Slider from "react-slick";

export default function ThisJustIn() {
  const dispatch = useDispatch();
  let [productList, setProductList] = useState([]);
  let [productPath, setProductPath] = useState("");
  let productObject = useSelector((state) => state.productList.value);
  let loading = useSelector((state) => state.productList.loading);
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (productObject.data !== undefined) {
      setProductList(productObject.data);
      setProductPath(productObject.path);
    }
  }, [productObject]);

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
          {loading
            ? [...Array(4)].map((_, index) => (
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
            : productList.map((product, index) => (
                <div key={index} className="px-2">
                  <Card
                    key={index}
                    product={product}
                    productPath={productPath}
                    slugLink={product.slug}
                  />
                </div>
              ))}
        </Slider>
      </div>
      {/* </div> */}
    </section>
  );
}
