"use client"
import Link from 'next/link';
import { useSelector } from 'react-redux'

export default function Thankyou() {
  const user = useSelector((state) => state.userStatus.value);

  return (
    <section className="py-16  relative">
    <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-8 inline-flex">
            <div className="flex-col justify-start items-center gap-3 flex">
  <img src="/icons/successful.svg" alt="Order Confirmation" className="w-28" />
                <h2 className="text-center text-gray-900 text-3xl font-bold font-manrope leading-normal">{user.firstName ? user.firstName : "User"}, Thank You for Your Order!</h2>
                <p className="max-w-xl text-center text-gray-500 text-lg font-normal leading-8">Your order is in good hands! We&apos;ll notify you once it&apos;s en route. For now, here&apos;s a snapshot of your purchase</p>
            </div>
                <div className="w-full justify-center items-center gap-8 flex sm:flex-row flex-col">
                    <Link href={"/collections"}>
                    <button className="md:w-fit w-full px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 transition-all duration-700 ease-in-out rounded-xl justify-center items-center flex">
                        <span className="px-2 py-px text-indigo-600 text-base font-semibold leading-relaxed">Back to Shopping</span>
                    </button>    
                    </Link>
                    <Link href={"/user-dashboard/order"}>
                    <button className="md:w-fit w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 ease-in-out rounded-xl shadow-[0px_1px_2px_0px_rgba(16,_24,_40,_0.05)] justify-center items-center flex">
                        <span className="px-2 py-px text-white text-base font-semibold leading-relaxed">Track My Order</span>
                    </button>    
                    </Link>            
                </div>
        </div>
    </div>
</section>
                                        
  )
}
