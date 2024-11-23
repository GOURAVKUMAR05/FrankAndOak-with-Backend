"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { websiteBaseUrl } from "../config/config";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { logOut } from "../features/userSlice";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { fetchCartData } from "../features/cartListSlice";
import { useRazorpay } from "react-razorpay";
import { setLoginStatus } from "../features/loginStatusSlice";

export default function Checkout() {
  const { error, isLoading, Razorpay } = useRazorpay();
  let dispatch = useDispatch();
  const router = useRouter();
  let [orderSummary, setOrderSummary] = useState(false);
  const user = useSelector((state) => state.userStatus.value);
  let [viewcartData, setViewCartData] = useState([]);
  let [productPath, setProductPath] = useState("");
  let [shippingAddress, setShippingAddress] = useState({
    countryName: "",
    firstName: "",
    lastName: "",
    userAddress: "",
    userSubAddress: "",
    cityName: "",
    stateName: "",
    zipCode: "",
    userPhone: "",
  });
  let [paymentType, setPaymentType] = useState(0);
  let cartObject = useSelector((state) => state.cartList.value);
  useEffect(() => {
    if (user._id) {
      dispatch(fetchCartData(user._id));
    }
  }, [dispatch, user._id]);

  useEffect(() => {
    if (cartObject.data !== undefined) {
      setViewCartData(cartObject.data);
      setProductPath(cartObject.path);
    }
  }, [cartObject]);

  let getSetValue = (event) => {
    let oldData = { ...shippingAddress };
    oldData[event.target.name] = event.target.value;
    setShippingAddress(oldData);
  };

  const totalPrice = viewcartData
    .reduce((acc, item) => {
      return acc + item.product.productPrice * item.quantity;
    }, 0)
    .toFixed(2);

  const totalQuantity = viewcartData.reduce((acc, item) => {
    return acc + item.quantity;
  }, 0);

  const randomData = "1234567890QWERTYUIOPASDFGHJKLZXCVBNM";
  let codOrderId = "";
  for (let i = 0; i < 12; i++) {
    codOrderId += randomData[Math.floor(Math.random() * randomData.length)];
  }

  let clearCart = () => {
    axios
      .delete(websiteBaseUrl + `cart/clear-cart/${user._id}`)
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          dispatch(fetchCartData(user._id));
        }
      })
      .catch((error) => {
        toast.error("Server error occurred.");
      });
  };

  let saveOrder = (event) => {
    if (user._id) {
      event.preventDefault();
      let userData = {
        user: user._id,
        shippingAddress: shippingAddress,
        paymentType: paymentType,
        productCart: viewcartData,
        orderAmount: totalPrice,
        orderQuantity: totalQuantity,
        orderId: codOrderId,
        orderStatus: "Pending",
        paymentStatus: 1,
        razorpayPaymentId: "",
        razorpayOrderId: "",
      };
      if (userData.productCart.length > 0) {
        axios.post(websiteBaseUrl + "order/save-order", userData).then((res) => {
            if (res.data.status) {
              if (paymentType == 1) {
                toast.success("Order Placed.");
                clearCart();
                router.push("/pages/thankyou");
              } else if (paymentType == 2) {
                const options = {
                  key: "rzp_test_bQlyV7ucVx6ogo", // Enter the Key ID generated from the Dashboard
                  // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise-
                  amount: Math.floor(totalPrice) * 100, 
                  currency: "INR",
                  name: "Frank and Oak",
                  description: "E-commerce shopping store",
                  image:
                    "https://yt3.googleusercontent.com/_S2V4UuAiqzTM1uAoGt4Iern2up_jSnYTMloUPNHKz-gmfMJnWxHgOp3s8a0hoTl4pxUVSB6mA=s900-c-k-c0x00ffffff-no-rj",
                  order_id: res.data.id, // Tis is order id comes as response when we save the order through paymentType==2 (Razorpay).
                  handler: function (response) {
                    console.log(response);  // {razorpay_order_id: "", razorpay_payment_id:"", razorpay_signature:" "}
                    axios
                      .post(websiteBaseUrl + "order/verify-razorpay-transaction", response)
                      .then((res) => {
                        if (res.data.status) {
                          toast.success(res.data.message);
                          clearCart();
                          router.push("/pages/thankyou");
                        }
                      })
                      .catch((error) => {
                        toast.error("Server error occurred.");
                      });
                  },
                  prefill: {
                    name: "Roshan",
                    email: "roshanchaurasia990@gmail.com",
                    contact: "7355260719",
                  },
                  theme: {
                    color: "#000",
                  },
                };

                const rzp1 = new Razorpay(options);

                rzp1.open();
              } else {
                // Stripe payment integration
                clearCart();
              }
            }
          })
          .catch((error) => {
            toast.error(error.message);
          });
      } else {
        toast("Cart is empty. Add Products.", {
          icon: "🛒",
        });
      }
    } else {
      dispatch(setLoginStatus(true));
      toast.error("Please Login to checkout.");
    }
  };
  return (
    <>
      <header className="w-full border-b border-customBorder py-2 font-Poppins">
        <Toaster position="bottom-right" reverseOrder={false} />
        <div className="max-w-[1150px] mx-auto flex items-center justify-between">
          <Link href={"/"}>
            <div className="font-bold text-[36px]">Frank And Oak</div>
          </Link>
          <Link href={"/pages/cart"}>
            <IoBagHandleOutline size={30} />
          </Link>
        </div>
      </header>
      <div
        onClick={() => setOrderSummary(!orderSummary)}
        className="lg:hidden bg-[#F5F5F5] cursor-pointer w-full py-5 px-10 border-y flex items-center justify-between border-customBorder"
      >
        <div className="flex text-sm items-center gap-2">
          Show order summary{" "}
          {orderSummary ? (
            <MdKeyboardArrowUp size={20} />
          ) : (
            <MdKeyboardArrowDown size={20} />
          )}
        </div>
        <div className="text-[19px] font-semibold">$345.05</div>
      </div>
      <section className="grid lg:grid-cols-[55%_auto] grid-cols-1 mx-auto font-Poppins">
        <div className="h-screen flex justify-end lg:order-1 order-2">
          <form
            onSubmit={saveOrder}
            className="lg:w-[75%] w-full px-5 py-10 overflow-y-scroll h-screen scrollbar-hide"
          >
            <div className="border-b border-customBorder pb-3">
              <div className="flex items-center justify-between pt-2">
                <div className="text-sm font-normal">Account</div>
                <button className="p-1.5 bg-[#F2F2F2] rounded-md">
                  <MdKeyboardArrowUp />
                </button>
              </div>
              <div className="text-sm font-normal py-2">
                {user.userEmail ? user.userEmail : "Login to buy products !"}
              </div>
              <button
                onClick={() => dispatch(logOut())}
                className="underline text-sm font-normal"
              >
                Log out
              </button>
            </div>
            <div className="cursor-pointer pt-3">
              <input
                id="checkbox"
                type="checkbox"
                className="form-checkbox checked:bg-black rounded-sm focus:ring-white text-black h-4 w-4 me-2"
              />
              <label className="text-sm font-normal" htmlFor="checkbox">
                Email me with news and offers
              </label>
            </div>
            <div className="space-y-4 py-5">
              <h4 className="font-semibold text-[20px]">Delivery</h4>
              <select
                className="w-full rounded-md py-3 text-sm border-customBorder focus:ring-customBorder"
                name="countryName"
                id="country"
                onChange={getSetValue}
                required
              >
                <option value="India">India</option>
                <option value="United States">United States</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <div class="relative">
                  <input
                    type="text"
                    id="floating_filled"
                    onChange={getSetValue}
                    name="firstName"
                    required
                    class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                    placeholder=" "
                  />
                  <label
                    for="floating_filled"
                    class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    First name
                  </label>
                </div>
                <div class="relative">
                  <input
                    type="text"
                    id="floating_filled"
                    onChange={getSetValue}
                    name="lastName"
                    required
                    class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                    placeholder=" "
                  />
                  <label
                    for="floating_filled"
                    class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Last name
                  </label>
                </div>
              </div>
              <div class="relative">
                <input
                  type="text"
                  name="userAddress"
                  onChange={getSetValue}
                  required
                  id="floating_outlined"
                  class="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=""
                />
                <label
                  for="floating_outlined"
                  class="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Address
                </label>
              </div>
              <div>
                <div class="relative">
                  <input
                    type="text"
                    onChange={getSetValue}
                    name="userSubAddress"
                    required
                    id="floating_filled"
                    class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                    placeholder=" "
                  />
                  <label
                    for="floating_filled"
                    class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    Apartment,suite, etc. (optional)
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div class="relative">
                  <input
                    type="text"
                    onChange={getSetValue}
                    required
                    name="cityName"
                    id="floating_filled"
                    class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                    placeholder=" "
                  />
                  <label
                    for="floating_filled"
                    class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    City
                  </label>
                </div>
                <select
                  onChange={getSetValue}
                  required
                  className="w-full rounded-md py-3 text-sm border-customBorder focus:ring-customBorder"
                  name="stateName"
                  id="state"
                >
                  {shippingAddress.countryName == "India" ? (
                    <>
                      <option value="AP">Andhra Pradesh</option>
                      <option value="AR">Arunachal Pradesh</option>
                      <option value="AS">Assam</option>
                      <option value="BR">Bihar</option>
                      <option value="CT">Chhattisgarh</option>
                      <option value="GA">Gujarat</option>
                      <option value="HR">Haryana</option>
                      <option value="HP">Himachal Pradesh</option>
                      <option value="JK">Jammu and Kashmir</option>
                      <option value="GA">Goa</option>
                      <option value="JH">Jharkhand</option>
                      <option value="KA">Karnataka</option>
                      <option value="KL">Kerala</option>
                      <option value="MP">Madhya Pradesh</option>
                      <option value="MH">Maharashtra</option>
                      <option value="MN">Manipur</option>
                      <option value="ML">Meghalaya</option>
                      <option value="MZ">Mizoram</option>
                      <option value="NL">Nagaland</option>
                      <option value="OR">Odisha</option>
                      <option value="PB">Punjab</option>
                      <option value="RJ">Rajasthan</option>
                      <option value="SK">Sikkim</option>
                      <option value="TN">Tamil Nadu</option>
                      <option value="TG">Telangana</option>
                      <option value="TR">Tripura</option>
                      <option value="UT">Uttarakhand</option>
                      <option value="UP">Uttar Pradesh</option>
                      <option value="WB">West Bengal</option>
                      <option value="AN">Andaman and Nicobar Islands</option>
                      <option value="CH">Chandigarh</option>
                      <option value="DN">Dadra and Nagar Haveli</option>
                      <option value="DD">Daman and Diu</option>
                      <option value="DL">Delhi</option>
                      <option value="LD">Lakshadweep</option>
                      <option value="PY">Puducherry</option>
                    </>
                  ) : (
                    <>
                      <option value="AL">Alabama</option>
                      <option value="AK">Alaska</option>
                      <option value="AZ">Arizona</option>
                      <option value="AR">Arkansas</option>
                      <option value="CA">California</option>
                      <option value="CO">Colorado</option>
                      <option value="CT">Connecticut</option>
                      <option value="DE">Delaware</option>
                      <option value="DC">District Of Columbia</option>
                      <option value="FL">Florida</option>
                      <option value="GA">Georgia</option>
                      <option value="HI">Hawaii</option>
                      <option value="ID">Idaho</option>
                      <option value="IL">Illinois</option>
                      <option value="IN">Indiana</option>
                      <option value="IA">Iowa</option>
                      <option value="KS">Kansas</option>
                      <option value="KY">Kentucky</option>
                      <option value="LA">Louisiana</option>
                      <option value="ME">Maine</option>
                      <option value="MD">Maryland</option>
                      <option value="MA">Massachusetts</option>
                      <option value="MI">Michigan</option>
                      <option value="MN">Minnesota</option>
                      <option value="MS">Mississippi</option>
                      <option value="MO">Missouri</option>
                      <option value="MT">Montana</option>
                      <option value="NE">Nebraska</option>
                      <option value="NV">Nevada</option>
                      <option value="NH">New Hampshire</option>
                      <option value="NJ">New Jersey</option>
                      <option value="NM">New Mexico</option>
                      <option value="NY">New York</option>
                      <option value="NC">North Carolina</option>
                      <option value="ND">North Dakota</option>
                      <option value="OH">Ohio</option>
                      <option value="OK">Oklahoma</option>
                      <option value="OR">Oregon</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="RI">Rhode Island</option>
                      <option value="SC">South Carolina</option>
                      <option value="SD">South Dakota</option>
                      <option value="TN">Tennessee</option>
                      <option value="TX">Texas</option>
                      <option value="UT">Utah</option>
                      <option value="VT">Vermont</option>
                      <option value="VA">Virginia</option>
                      <option value="WA">Washington</option>
                      <option value="WV">West Virginia</option>
                      <option value="WI">Wisconsin</option>
                      <option value="WY">Wyoming</option>
                    </>
                  )}
                </select>
                <div class="relative">
                  <input
                    type="text"
                    onChange={getSetValue}
                    name="zipCode"
                    id="floating_filled"
                    class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                    placeholder=" "
                  />
                  <label
                    for="floating_filled"
                    class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                  >
                    ZIP Code
                  </label>
                </div>
              </div>
              <div class="relative">
                <input
                  type="tel"
                  onChange={getSetValue}
                  name="userPhone"
                  id="floating_filled"
                  class="block rounded-md px-2.5 pb-2.5 pt-5 w-full text-sm text-gray-900  appearance-none  focus:outline-none focus:ring-0 peer border border-customBorder"
                  placeholder=" "
                />
                <label
                  for="floating_filled"
                  class="absolute text-sm  duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] start-2.5 peer-focus:text-blue-600  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
                >
                  Phone
                </label>
              </div>
            </div>
            <div className="space-y-4 py-5">
              <h4 className="font-semibold">Payment method</h4>
              <div className="bg-[#F5F5F5] text-sm font-normal text-[#707070] p-5">
                Select your payment method.
                <div className="flex flex-col pt-3 space-y-2">
                  <div class="inline-flex items-center">
                    <label
                      class="relative flex items-center cursor-pointer"
                      for="COD"
                    >
                      <input
                        onChange={() => setPaymentType(1)}
                        name="payment"
                        type="radio"
                        class=" bg-white text-black cursor-pointer"
                        id="COD"
                      />
                      <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label
                      class="ml-2 text-black cursor-pointer text-sm"
                      for="COD"
                    >
                      Cash on Delivery
                    </label>
                  </div>
                  <div class="inline-flex items-center">
                    <label
                      class="relative flex items-center cursor-pointer"
                      for="razorpay"
                    >
                      <input
                        onChange={() => setPaymentType(2)}
                        name="payment"
                        type="radio"
                        class=" bg-white text-black cursor-pointer"
                        id="razorpay"
                      />
                      <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label
                      class="ml-2 text-black cursor-pointer text-sm"
                      for="razorpay"
                    >
                      Pay with Razorpay
                    </label>
                  </div>
                  <div class="inline-flex items-center">
                    <label
                      class="relative flex items-center cursor-pointer"
                      for="stripe"
                    >
                      <input
                        onChange={() => setPaymentType(3)}
                        name="payment"
                        type="radio"
                        class=" bg-white text-black cursor-pointer"
                        id="stripe"
                      />
                      <span class="absolute bg-slate-800 w-3 h-3 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity duration-200 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></span>
                    </label>
                    <label
                      class="ml-2 text-black cursor-pointer text-sm"
                      for="stripe"
                    >
                      Pay with Stripe
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="cursor-pointer">
                  <input
                    id="checkbox2"
                    type="checkbox"
                    className="form-checkbox checked:bg-black rounded-sm focus:ring-white text-black h-4 w-4 me-2"
                  />
                  <label className="text-sm font-normal" htmlFor="checkbox2">
                    Shipping Protection
                  </label>
                </div>
                <div className="text-sm font-normal">$8.55</div>
              </div>
            </div>
            <div className="space-y-4 py-5">
              <h4 className="font-semibold">Remember me</h4>
              <div>
                <div className="border border-customBorder rounded-md p-4 ">
                  <div className="cursor-pointer">
                    <input
                      id="checkbox3"
                      type="checkbox"
                      className="form-checkbox checked:bg-black rounded-sm focus:ring-white text-black h-4 w-4 me-2"
                    />
                    <label className="text-sm font-normal" htmlFor="checkbox3">
                      Save my information for a faster checkout
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="bg-black text-white rounded-md w-full  font-semibold py-5"
            >
              Order Now
            </button>
            <div className="border-t border-customBorder mt-20">
              <div className="flex gap-3 py-3">
                <p className="text-sm font-normal underline">Refund policy</p>
                <p className="text-sm font-normal underline">Privacy policy</p>
                <p className="text-sm font-normal underline">
                  Terms of service
                </p>
              </div>
            </div>
          </form>
        </div>
        <div
          className={`lg:block ${
            orderSummary ? "block" : "hidden"
          } h-full duration-200 bg-[#F4F8F7] p-10 lg:order-2 order-1`}
        >
          <div className="lg:w-[75%] w-full">
            <div className="space-y-3">
              {viewcartData.length > 0
                ? viewcartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <figure className="relative border bg-[#E8F0EE] border-customBorder rounded-md px-2">
                        <img
                          className="w-12"
                          src={productPath + item.product.productImage}
                          alt={item.product.productName}
                        />
                        <div className="absolute right-[-12%] top-[-12%] w-[20px] h-[20px] rounded-full text-[12px]  text-white bg-[#6B6D6D] flex justify-center items-center">
                          {item.quantity}
                        </div>
                      </figure>
                      <div className="flex items-center w-[80%] py-3 justify-between gap-5">
                        <div>
                          <h6 className="text-sm font-normal">
                            {item.product.productName}
                          </h6>
                          <span className="text-[12px] font-normal text-[#0000008f]">
                            {item.size.sizeName}
                          </span>
                        </div>
                        <div className="text-sm font-normal">
                          ${item.product.productPrice}
                        </div>
                      </div>
                    </div>
                  ))
                : ""}

              {/* <div className="flex items-center gap-3">
                <figure className="relative border bg-[#E8F0EE] border-customBorder rounded-md px-2">
                  <img
                    src="https://cdn.shopify.com/s/files/1/0555/5722/6653/files/1910082-002.3037_64x64.jpg?v=1726773509"
                    alt=""
                  />
                  <div className="absolute right-[-12%] top-[-12%] w-[20px] h-[20px] rounded-full text-[12px]  text-white bg-[#6B6D6D] flex justify-center items-center">
                    2
                  </div>
                </figure>
                <div className="flex items-center w-[80%] py-3 justify-between gap-5">
                  <div>
                    <h6 className="text-sm font-normal">
                      The Classic Tie in Black
                    </h6>
                    <span className="text-[12px] font-normal text-[#0000008f]">
                      One Size
                    </span>
                  </div>
                  <div className="text-sm font-normal">$39.50</div>
                </div>
              </div> */}
            </div>
            <div className="border-t border-[#E3E3E3] py-5 mt-5">
              <form className="grid grid-cols-[80%_auto] gap-4">
                <input
                  className="px-3 py-3 bg-white text-customGray text-sm font-normal border border-[#D2D9D7] rounded-md"
                  type="text"
                  placeholder="Discount code or gift card"
                />
                <button className="bg-[#E8F0EE]  text-sm font-normal px-3 text-[#666969] py-3 border border-[#D2D9D7] rounded-md">
                  Apply
                </button>
              </form>
              <div className="pt-5 space-y-3">
                <div className="flex justify-between ">
                  <div className="text-sm font-normal">
                    Subtotal • {viewcartData.length} items
                  </div>
                  <div className="text-sm font-normal">${totalPrice}</div>
                </div>
                <div className="flex justify-between">
                  <div className="text-sm font-normal">Shipping</div>
                  <div className="text-sm font-normal text-[#0000008f]">
                    Enter shipping address
                  </div>
                </div>
                <div className="flex justify-between pt-5">
                  <div className=" text-[19px] font-semibold">Total</div>
                  <div className="font-semibold  text-[19px]">
                    <span className="text-sm text-[#0000008f] font-normal">
                      USD
                    </span>{" "}
                    ${totalPrice}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
