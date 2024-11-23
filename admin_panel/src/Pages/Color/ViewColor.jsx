import React, { useEffect, useState } from 'react'
import Breadcrumb from '../../common/Breadcrumb'
import axios from 'axios'
import { AdminBaseURL } from '../../config/config'
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Link } from 'react-router-dom';
import ResponsivePagination from 'react-responsive-pagination';

export default function ViewColor() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,setTotalPages] = useState(0);
    let [allCheckedId,setAllCheckedId]=useState([])
    let [colorData,setColorData]=useState([])
    let [searchData,setSearchData]=useState({
      colorName:"",
      colorCode:"",
      pageNumber:1
    })
    let viewColor=()=>{
      let obj={...searchData}
      obj['pageNumber']=currentPage
        axios.get(AdminBaseURL+"/color/view",{params: obj})
        .then((res)=>{
            if(res.data.status==1){
                setColorData(res.data.dataList)
                setTotalPages(res.data.allPage)
                console.log(res.data)
            }
        })
    }

    let deleteSingleColor=(id)=>{
        const swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: true,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
              confirmButtonColor: "#F90101",
              cancelButtonColor: "#0D0D0D",
            })
            .then((result) => {
              if (result.isConfirmed) {
                axios.delete(AdminBaseURL+`/color/delete/${id}`)
                .then((res)=>{
                    if(res.data.status===1){
                        console.log(res.data)
                        swalWithBootstrapButtons.fire({
                          title: "Deleted!",
                          text: "Your file has been deleted.",
                          icon: "success",
                        });
                        viewColor();
                    }
                })
                .catch((error)=>{
                    swalWithBootstrapButtons.fire({
                        title: "Error!",
                        text: "An server error occurred !",
                        icon: "error",
                      });
                })
              } else if (
                result.dismiss === Swal.DismissReason.cancel
              ) {
                swalWithBootstrapButtons.fire({
                  title: "Cancelled",
                  text: "Your imaginary file is safe :)",
                  icon: "error",
                });
              }
            });
    }

    let getAllCheckedID=(event)=>{
        if(event.target.checked){
            // console.log(event.target.value)
            setAllCheckedId([...allCheckedId,event.target.value])
        }
        else{
            let filteredId=allCheckedId.filter((id)=> id!=event.target.value)
            setAllCheckedId(filteredId)
        }

    }
    let multipleRowDelete=()=>{
      if(allCheckedId.length==0){
        Swal.fire({
          title: "Please select Checkboxes to delete data !",
        });
      }
      else{
        const swalWithBootstrapButtons = Swal.mixin({
            buttonsStyling: true,
          });
          swalWithBootstrapButtons
            .fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Yes, delete it!",
              cancelButtonText: "No, cancel!",
              reverseButtons: true,
              confirmButtonColor: "#F90101",
              cancelButtonColor: "#0D0D0D",
            })
            .then((result) => {
              if (result.isConfirmed) {
                axios.post(AdminBaseURL+"/color/multiple-delete",{ids: allCheckedId})
                .then((res)=>{
                    if(res.data.status===1){
                        console.log(res.data)
                        swalWithBootstrapButtons.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success",
                          });
                          viewColor();
                    }
                })
                .catch((error)=>{
                    swalWithBootstrapButtons.fire({
                        title: "Error!",
                        text: "An server error occurred !",
                        icon: "error",
                      });
                })
              } else if (
                result.dismiss === Swal.DismissReason.cancel
              ) {
                swalWithBootstrapButtons.fire({
                  title: "Cancelled",
                  text: "Your imaginary file is safe :)",
                  icon: "error",
                });
              }
            });
          }
    }
    
    let getSearchData=(event)=>{
      let oldSearchedData={...searchData}
      let inputName=event.target.name
      let inputValue=event.target.value
      oldSearchedData[inputName]=inputValue
      setSearchData(oldSearchedData)
    }
    let submitSearchForm=(event)=>{
      event.preventDefault()
      viewColor()
    }
    useEffect(()=>{
        viewColor()
    },[])
    useEffect(()=>{
        console.log(allCheckedId)
    },[allCheckedId])
    useEffect(()=>{
      viewColor()
    },[searchData])
    useEffect(()=>{
      viewColor()
    },[currentPage])
    return (
    <>
    <Breadcrumb path={"Colors"} path2={"View Color"} slash={"/"} />
        <div className="w-full min-h-[610px]">
          <div className="max-w-[1220px] mx-auto py-5">
          <form
            onSubmit={submitSearchForm}
            className="grid grid-cols-3 gap-3 items-baseline py-3"
          >
            <div class="relative">
              <input
                type="text"
                id="small_outlined"
                name="colorName"
                onChange={getSearchData}
                value={searchData.colorName}
                class="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="small_outlined"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Search by Color Name
              </label>
            </div>
            <div class="relative">
              <input
                type="text"
                id="small_outlined2"
                name="colorCode"
                onChange={getSearchData}
                value={searchData.colorCode}
                class="block border-2 font-semibold px-2.5 py-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="small_outlined2"
                class="absolute text-sm text-gray-500  duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
              >
                Search by Color Code
              </label>
            </div>
            <div className="grid-cols-2">
              <button
                type="submit"
                class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center me-2 mb-2"
              >
                Search
              </button>
            </div>
          </form>
            <h3 className="text-[26px] font-semibold bg-slate-100 py-3 px-4 rounded-t-md border border-slate-400">
              Add colors
            </h3>
            <div className="border border-t-0 rounded-b-md border-slate-400">
                

<div className="relative overflow-x-auto">
    <table className="w-full  text-left rtl:text-right text-gray-500 ">
        <thead className="text-sm text-gray-700 uppercase bg-gray-50 ">
            <tr>
                <th scope="col" className="px-6 py-3">
                <button
                        type="button"
                        onClick={multipleRowDelete}
                        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                      >
                        Delete
                      </button>
                </th>
                <th scope="col" className="px-6 py-3">
                    Color Name 
                </th>
                <th scope="col" className="px-6 py-3">
                    Color Code
                </th>
                <th scope="col" className="px-6 py-3">
                    Action
                </th>
                <th scope="col" className="px-6 py-3">
                    Status
                </th>
            </tr>
        </thead>
        <tbody>
            {
                colorData.length>=1 ?
                colorData.map((item,index)=>(
                    <tr key={index} className="bg-white border-b ">
                    <th scope="row" className="px-6 py-4 text-[18px] font-semibold text-gray-900 whitespace-nowrap ">
                    <input name='deleteCheck' onChange={getAllCheckedID} value={item._id} checked={allCheckedId.includes(item._id) ? true : ""} id="purple-checkbox" type="checkbox" className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 "/>
                    </th>
                    <td className="px-6 py-4">
                        {item.colorName}
                    </td>
                    <td className="px-6 py-4">
                        {item.colorCode}
                    </td>
                    <td className="px-6 py-4 flex gap-3">
                    <svg onClick={()=>deleteSingleColor(item._id)} fill='red' className='w-4 h-4 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M170.5 51.6L151.5 80l145 0-19-28.4c-1.5-2.2-4-3.6-6.7-3.6l-93.7 0c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80 368 80l48 0 8 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-8 0 0 304c0 44.2-35.8 80-80 80l-224 0c-44.2 0-80-35.8-80-80l0-304-8 0c-13.3 0-24-10.7-24-24S10.7 80 24 80l8 0 48 0 13.8 0 36.7-55.1C140.9 9.4 158.4 0 177.1 0l93.7 0c18.7 0 36.2 9.4 46.6 24.9zM80 128l0 304c0 17.7 14.3 32 32 32l224 0c17.7 0 32-14.3 32-32l0-304L80 128zm80 64l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0l0 208c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-208c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>
                    | <Link to={`/colors/add-color/${item._id}`}>
                    <svg fill='gold' className='w-4 h-4 cursor-pointer' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/></svg>
                    </Link>
                    </td>
                    <td className="px-6 py-4">
                        {item.colorStatus ? "Active" : "Deactive"}
                    </td>
                </tr>
                ))
            :
            <tr className="bg-white border-b">
                <td colSpan={6} className="py-3 w-full px-3">
                    No Data Found
                </td>
            </tr>
            }
        </tbody>
    </table>
    <div className='py-5'>
    <ResponsivePagination
      current={currentPage}
      total={totalPages}
      onPageChange={setCurrentPage}
    />
    </div>
</div>

            </div>
          </div>
        </div>
        </>
  )
}
