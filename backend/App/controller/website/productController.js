const { productModal } = require("../../modal/admin/productModal")

const activeProducts=async (req,res)=>{
    try{
        let productList=await productModal.find({productStatus:true})
        .populate('productParentCategoryId')
        .populate('productSubCategoryId')
        .populate(['productSizeId'])
        .populate(['productColorId'])

        res.status(200).json({
            status:1,
            path:process.env.PRODUCT_STATIC_PATH,
            data:productList
        })
    }
    catch(error){
        res.status(200).json({
            status:0,
            error:error.message
        })
    }
}

const productDetail=async (req,res)=>{
    try{
        let {slugname}=req.params
        if(slugname){
            let productDetail=await productModal.findOne({slug:slugname})
            .populate('productParentCategoryId')
            .populate('productSubCategoryId')
            .populate(['productSizeId'])
            .populate(['productColorId'])
            if(productDetail){
                res.status(200).json({
                    status:1,
                    data:productDetail,
                    path:process.env.PRODUCT_STATIC_PATH
                })
            }
            else{
                res.status(200).json({
                    status:0,
                    message:"No Product found"
                })
            }
        }
    }
    catch(error){
        console.log("Error on Product Deltail: ",error.message )
        res.status(500).json({
            status:0,
            message:error.message
        })
    }
}

let filteredProductData=async(req,res)=>{
    try{
        let productCatId=req.params.id
        let productData=await productModal.find({productParentCategoryId:productCatId,productStatus:true})
        .populate('productParentCategoryId')
        .populate('productSubCategoryId')
        .populate(['productSizeId'])
        .populate(['productColorId'])
        res.status(200).json({
            status:1,
            data:productData,
            path:process.env.PRODUCT_STATIC_PATH
        })
    }
    catch(error){
        res.status(500).json({
            status:0,
            error:error.message
        })
    }
}

module.exports={activeProducts,productDetail, filteredProductData}