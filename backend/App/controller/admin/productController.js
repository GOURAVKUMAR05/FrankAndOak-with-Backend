const { myslug } = require("../../config/slugConfig");
const { categoryModel } = require("../../modal/admin/categoryModal");
const { colorModal } = require("../../modal/admin/colorModal");
const { productModal } = require("../../modal/admin/productModal");
const { sizeModal } = require("../../modal/admin/sizeModal");
const { subcategoryModel } = require("../../modal/admin/subCategoryModal");
const fs=require("fs")

let categoryView = async (req, res) => {
  let categoryData = await categoryModel.find({ categoryStatus: 1 });
  res.status(200).json({
    status: 1,
    datalist: categoryData,
  });
};

let subcategoryView = async (req, res) => {
  let pid = req.params.pid;
  let subcategoryData = await subcategoryModel.find({
    subCategoryStatus: 1,
    parentCategoryId: pid,
  });
  res.status(200).json({
    status: 1,
    datalist: subcategoryData,
  });
};

let sizeView = async (req, res) => {
  let sizeData = await sizeModal.find({ sizeStatus: 1 });
  res.status(200).json({
    status: 1,
    datalist: sizeData,
  });
};

let colorView = async (req, res) => {
  let colorData = await colorModal.find({ colorStatus: 1 });
  res.status(200).json({
    status: 1,
    datalist: colorData,
  });
};

let productInsert = async (req, res) => {
  try {
    // console.log(req.files)
    // console.log(req.body)
    let insertData = {
      productName: req.body.productName,
      productDescription: req.body.productDescription,
      productShortDesc: req.body.productShortDesc,
      productPrice: req.body.productPrice,
      productMRP: req.body.productMRP,
      productStatus: req.body.productStatus,
      productParentCategoryId: req.body.productParentCategoryId,
      productSubCategoryId: req.body.productSubCategoryId,
      productSizeId: req.body.productSizeId,
      productColorId: req.body.productColorId,
      slug:myslug(req.body.productName)
    };

    if (req.files) {
      if (req.files.productImage) {
        insertData["productImage"] = req.files.productImage[0].filename;
      }
      if (req.files.productAnimationImage) {
        insertData["productAnimationImage"] =
          req.files.productAnimationImage[0].filename;
      }
      if (req.files.productGallery) {
        insertData["productGallery"] = req.files.productGallery.map(
          (item) => item.filename
        );
      }
    }

    const productCollection = new productModal(insertData);
    let productRes = await productCollection.save();
    res.status(200).json({
      status: 1,
      res: productRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Internal server error !",
      error: error
    });
  }
};

let productView = async (req, res) => {
  let { productName, productShortDesc, pageNumber } = req.query;
  let searchObject = {};
  let limit = 5;
  if (productName !== "") {
    searchObject["productName"] = new RegExp(productName, "i");
  }
  if (productShortDesc !== "") {
    searchObject["productShortDesc"] = new RegExp(productShortDesc, "i");
  }
  try {
    let productData = await productModal
      .find(searchObject)
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate("productParentCategoryId", "categoryName")
      .populate("productSubCategoryId", "subCategoryName")
      .populate("productSizeId", "sizeName")
      .populate("productColorId", "colorName colorCode");
    let totalPageNumber = await productModal.find(searchObject);
    let allPage = Math.ceil(totalPageNumber.length / limit);
    if (productData) {
      res.status(200).json({
        status: 1,
        path: process.env.PRODUCT_STATIC_PATH,
        dataList: productData,
        allPage,
        limit,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error !",
      error: error.message,
    });
  }
};

let productSingleDelete = async (req, res) => {
  let id = req.params.id;
  let productData = await productModal.findOne({ _id: id });
  if (productData) {
    let path = "uploads/product/";
    let productImage = productData.productImage;
    let productAnimationImage = productData.productAnimationImage;
    let productGallery = productData.productGallery.forEach((item) => {
      let pdGalleryImgFullPath = path + item;
      fs.unlinkSync(pdGalleryImgFullPath);
    });
    let pdImgFullPath = path + productImage;
    let pdAnimationImgFullPath = path + productAnimationImage;
    fs.unlinkSync(pdImgFullPath);
    fs.unlinkSync(pdAnimationImgFullPath);
    let productSingleDelete = await productModal.deleteOne({ _id: id });
    if (productSingleDelete.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "No record found to delete.",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted.",
      res: productSingleDelete,
    });
  }
};

let productMultipleDelete=async(req,res)=>{
  try{
  let {ids}=req.body
  let productSingleDelete;
  for(let id of ids){
    let productData=await productModal.findOne({_id:id})
    if(productData){
      let path="uploads/product/"
      let productImage = productData.productImage;
      let productAnimationImage = productData.productAnimationImage;
      let productGallery=productData.productGallery.forEach((item)=>{
        let pdGalleryImgFullPath = path + item;
        fs.unlinkSync(pdGalleryImgFullPath);
      })
      let pdImgFullPath = path + productImage;
      let pdAnimationImgFullPath = path + productAnimationImage;
      fs.unlinkSync(pdImgFullPath);
      fs.unlinkSync(pdAnimationImgFullPath);
       productSingleDelete=await productModal.deleteOne({_id:id})
      if (productSingleDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
    }
  }
  res.status(200).json({
    status: 1,
    message: "Record deleted.",
    res: productSingleDelete,
  });
}
catch (error) {
  res.status(500).json({
    status: 0,
    message: "Server error occurred",
    error: error.message,
  });
}
}

let productEditRowData=async (req,res)=>{
  try{
  let id=req.params.id
  let productData=await productModal.findOne({_id:id})
  if(productData){
    return res.status(200).json({
      status:1,
      message:"Record found",
      path:process.env.PRODUCT_STATIC_PATH,
      res:productData
    })
  }
  res.status(200).json({
    status:0,
    message:"No record found."
  })
}
catch(error){
  res.status(500).json({
    status:0,
    message:"Internal server error.",
    error:error.message
  })
}
}

let productUpdateRowData=async(req,res)=>{
  try{
  let id=req.params.id
  let productData={
    productName:req.body.productName,
    productDescription:req.body.productDescription,
    productShortDesc:req.body.productShortDesc,
    productPrice:req.body.productPrice,
    productMRP:req.body.productMRP,
    productStatus:req.body.productStatus,
    productParentCategoryId:req.body.productParentCategoryId,
    productSubCategoryId:req.body.productSubCategoryId,
    productSizeId:req.body.productSizeId,
    productColorId:req.body.productColorId,
    slug:myslug(req.body.productName)
  }
  if(req.files){
    if (req.files.productImage) {
      productData["productImage"] = req.files.productImage[0].filename;
    }
    if (req.files.productAnimationImage) {
      productData["productAnimationImage"] =
        req.files.productAnimationImage[0].filename;
    }
    if (req.files.productGallery) {
      productData["productGallery"] = req.files.productGallery.map(
        (item) => item.filename
      );
    }
  }

  let productUpdate=await productModal.updateOne({_id:id}, {$set:productData})
  res.status(200).json({
    status: 1,
    message: "Record Updated.",
    res: productUpdate,
  });
}
catch(error){
  res.status(200).json({
    status: 0,
    message: "Server error occurred.",
    error: error.message,
  });
}
}
module.exports = {
  sizeView,
  colorView,
  categoryView,
  subcategoryView,
  productInsert,
  productView,
  productSingleDelete,
  productMultipleDelete,
  productEditRowData,
  productUpdateRowData
}
