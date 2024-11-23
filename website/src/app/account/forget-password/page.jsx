"use client";
import { websiteBaseUrl } from "@/app/config/config";
import axios from "axios";
import Link from "next/link";
import PinInput from "react-pin-input";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ForgetPassword() {
  const router = useRouter();
  let [otpVerify, setOtpVerify] = useState(true);
  let [changePassBox, setChangePassBox] = useState(true);
  let [OTP, setOTP] = useState("");
  let [userEmail, setUserEmail] = useState({
    userEmail: "",
    tncChecked: true,
    ForgetOTP: "",
  });
  let [changePassData, setChangePassData] = useState({
    password: "",
    confirmpassword: "",
  });

  let getSetValue = (event) => {
    let oldData = { ...userEmail };
    oldData[event.target.name] = event.target.value;
    setUserEmail(oldData);
  };

  let handleOTP = (value) => {
    setOTP(value);
    getSetValue({ target: { name: "ForgetOTP", value } });
  };

  let verifyOTP = (event) => {
    event.preventDefault();
    console.log(OTP);
    axios
      .post(websiteBaseUrl + "forget-password/otp-verification", { OTP })
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          setChangePassBox(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("Server Error Occurred.");
      });
  };

  let sendOtp = () => {
    axios
      .post(websiteBaseUrl + "forget-password/send-otp", userEmail)
      .then((res) => {
        if (res.data.status) {
          console.log("OTP Sended");
        }
      })
      .catch(() => {
        toast.error("Server error occurred.");
      });
  };

  let submitEmail = (event) => {
    event.preventDefault();
    axios
      .post(websiteBaseUrl + "forget-password/email-verification", userEmail)
      .then((res) => {
        if (res.data.status) {
          sendOtp();
          toast.success("OTP send to your email.");

          setOtpVerify(false);
        } else {
          toast.error(res.data.message);
        }
      })
      .catch((error) => {
        toast.error("Server error occurred.");
      });
  };

  let getPassValue = (event) => {
    let oldData = { ...changePassData };
    oldData[event.target.name] = event.target.value;
    setChangePassData(oldData);
  };

  let handleChangePassword = (event) => {
    event.preventDefault();
    axios
      .post(websiteBaseUrl + "forget-password/change-password", changePassData)
      .then((res) => {
        if (res.data.status) {
          toast.success(res.data.message);
          router.push("/");
        }
      })
      .catch((error) => {
        toast.error(res.data.message);
      });
  };
  return (
    <>
      {changePassBox ? (
        <section class="bg-gray-50">
          <Toaster position="top-center" reverseOrder={false} />
          <form
            onSubmit={submitEmail}
            class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
          >
            {otpVerify ? (
              <div class="w-full p-10  bg-white rounded-lg shadow-md  md:mt-0 sm:max-w-md sm:p-8">
                <h1 class="mb-1 text-xl font-bold leading-tight text-center tracking-tight text-gray-900 md:text-2xl">
                  Forget your password?
                </h1>
                <p class="font-normal text-gray-500 text-center">
                  Don&apos;t fret! Just type in your email and we will send you a
                  code to reset your password!
                </p>
                <div class="mt-4 space-y-6 lg:mt-5 md:space-y-5">
                  <div>
                    <label
                      for="email"
                      class="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Your email
                    </label>
                    <input
                      onChange={getSetValue}
                      value={userEmail.userEmail}
                      type="email"
                      name="userEmail"
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                      placeholder="name@company.com"
                      required
                    />
                  </div>
                  <div class="flex items-start">
                    <div class="flex items-center h-5">
                      <input
                        onChange={getSetValue}
                        value={userEmail.tncChecked}
                        name="tncChecked"
                        type="checkbox"
                        class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300"
                        required
                      />
                    </div>
                    <div class="ml-3 text-sm">
                      <label for="terms" class="font-light text-gray-500">
                        I accept the{" "}
                        <a
                          class="font-medium text-primary-600 hover:underline"
                          href="#"
                        >
                          Terms and Conditions
                        </a>
                      </label>
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="border-2 w-full py-2 px-5 bg-black hover:bg-white text-white duration-500 hover:text-black hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium rounded-md"
                    >
                      Forget password
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div class="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
                <div class="mx-auto flex w-full max-w-md flex-col space-y-10">
                  <div class="flex flex-col items-center justify-center text-center space-y-2">
                    <div class="font-semibold text-3xl">
                      <p>Email Verification</p>
                    </div>
                    <div class="flex flex-row text-sm font-medium text-gray-400">
                      <p>
                        We have sent a code to your email{" "}
                        <span className="font-semibold">
                          {userEmail.userEmail}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <div>
                      <div class="flex flex-col space-y-4">
                        <div>
                          <div class="flex items-center justify-center px-6 py-5  mx-auto w-full">
                            <PinInput
                              name="ForgetOTP"
                              length={4}
                              required
                              placeholder="0"
                              type="numeric"
                              onChange={(value) => handleOTP(value)}
                              value={OTP}
                            />
                          </div>
                          <div>
                            <button
                              onClick={verifyOTP}
                              className="border-2 w-full mx-auto table py-3 px-16 bg-black hover:bg-white text-white duration-500 hover:text-black hover:shadow-[5px_5px_0px_0px_#666] border-black font-medium rounded-md"
                            >
                              Verify Account
                            </button>
                          </div>
                        </div>

                        <div class="flex flex-col">
                          <div class="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                            <p>Didn&apos;t recieve code?</p>{" "}
                            <button
                              onClick={sendOtp}
                              class="flex hover:underline flex-row items-center text-blue-600 cursor-pointer"
                            >
                              Resend OTP
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </section>
      ) : (
        <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-12">
          <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
            <form onSubmit={handleChangePassword} className=" w-full">
              <h4 className="font-medium text-[26px] pb-5">Reset Password</h4>
              <div className="space-y-4">
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-[13px] mb-1 font-medium"
                  >
                    Password
                  </label>
                  <input
                    onChange={getPassValue}
                    value={changePassData.password}
                    className="w-full border-black font-medium"
                    id="password"
                    name="password"
                    type="password"
                  />
                  <button className="text-[13px] underline font-medium absolute right-3 top-[50%]">
                    Show
                  </button>
                </div>
                <div className="relative">
                  <label
                    htmlFor="confirmpassword"
                    className="block text-[13px] mb-1 font-medium"
                  >
                    Confirm Password
                  </label>
                  <input
                    onChange={getPassValue}
                    value={changePassData.confirmpassword}
                    className="w-full border-black font-medium"
                    id="confirmpassword"
                    name="confirmpassword"
                    type="password"
                  />
                  <button className="text-[13px] underline font-medium absolute right-3 top-[50%]">
                    Show
                  </button>
                </div>
                <div className="space-x-20 flex justify-end">
                  <button className="text-customGray hover:text-black hover:underline font-semibold text-sm">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-black text-white font-medium py-3 px-16 text-sm hover:shadow-Btn-shadow"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>
      )}
    </>
  );
}
