"use client";
import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

import { IoCloseSharp } from "react-icons/io5";
export default function DiscountModel() {
  let [discountModel, setDiscountModel] = useState(false);
  return (
    <>
      <div className="fixed md:block hidden bottom-5 left-5 z-[9999999999]">
        <button
          onClick={() => setDiscountModel(true)}
          className={`${
            discountModel ? "opacity-0 invisible" : "opacity-100 visible"
          } duration-50 bg-black text-white p-4 text-[15px] font-medium rounded-md shadow-lg`}
        >
          Unlock 30% Off*
        </button>
      </div>

      <div
        className={`${
          discountModel ? "opacity-100 visible" : "opacity-0 invisible"
        } duration-500 z-[999999999]`}
      >
        <div
          onClick={() => setDiscountModel(false)}
          className=" z-[9999999999] fixed top-0 left-0 w-full h-screen bg-black opacity-50"
        ></div>
        <div className="z-[9999999999]  h-[500px] grid lg:grid-cols-2 grid-cols-1 fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <button
            onClick={() => setDiscountModel(false)}
            className="absolute top-3 right-3 rounded-full bg-black opacity-80 p-1"
          >
            <IoCloseSharp className="text-white text-[22px]" />
          </button>

          <div className="flex items-center justify-center flex-col p-5 bg-white">
            <div className="text-center">
              <div className="md:text-[32px] text-[18px] font-medium">Unlock</div>
              <h3 className="md:text-[35px] text-[24px] font-semibold">Early Black Friday</h3>
              <div className="md:text-[32px] text-[22px]  font-medium">now</div>
            </div>
            <form>
              {/* <input className='w-full mt-5 p-2  font-medium ' type="tel" placeholder='Phone Number' /> */}

              <PhoneInput
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: true,
                }}
                inputClass="phone-input-full"
                placeholder="Phone Number"
                country="in"
              />

              <p className="text-[10px] font-medium py-5">
                By submitting this form and signing up for texts, you consent to
                receive marketing text messages (e.g. promos, cart reminders)
                from Frank And Oak at the number provided, including messages
                sent by autodialer. Consent is not a condition of purchase. Msg
                & data rates may apply. Msg frequency varies. Unsubscribe at any
                time by replying STOP or clicking the unsubscribe link (where
                available). Privacy Policy & Terms.
              </p>
              <button className="bg-black text-white p-4 w-full text-[15px] font-medium rounded-md shadow-lg">
                Unlock 30% Off*
              </button>
            </form>
          </div>
          <div className="lg:block hidden">
            <img
            className="w-full h-full object-cover"
              src="https://d3k81ch9hvuctc.cloudfront.net/company/RgkqqK/images/cb54fbf5-a1db-4bf4-b463-5ec32b33ca55.jpeg"
              alt=""
            />
          </div>
        </div>
      </div>
    </>
  );
}
