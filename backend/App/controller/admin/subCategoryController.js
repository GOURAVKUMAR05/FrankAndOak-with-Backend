const { myslug } = require("../../config/slugConfig");
const { categoryModel } = require("../../modal/admin/categoryModal");
const { subcategoryModel } = require("../../modal/admin/subCategoryModal");
const fs = require("fs");
let parentCategoryView = async (req, res) => {
  try {
    let categoryData = await categoryModel.find({ categoryStatus: 1 });
    res.status(200).json({
      status: 1,
      datalist: categoryData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal Server Error",
      error: error,
    });
  }
};

let subCategoryInsert = async (req, res) => {
  let subCategoryData = {
    subCategoryName: req.body.subCategoryName,
    parentCategoryId: req.body.parentCategoryId,
    subcatDescription: req.body.subcatDescription,
    subCategoryStatus: req.body.subCategoryStatus,
    slug:myslug(req.body.subCategoryName)
  };
  if (req.file) {
    if (req.file.filename) {
      subCategoryData["subCategoryImage"] = req.file.filename;
    }
  }
  try {
    const subCategoryCollection = new subcategoryModel(subCategoryData);

    let subCatRes = await subCategoryCollection.save();
    res.status(200).json({
      status: 1,
      message: "Data saved.",
      res: subCatRes,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "sub category already exists !",
      error: error,
    });
  }
};

let subCategoryView = async (req, res) => {
  let searchObject = {};
  let limit = 5;
  try {
    let { subCatName, subCatDesc, pageNumber } = req.query;
    if (subCatName !== "") {
      searchObject["subCatName"] = new RegExp(subCatName, "i");
    }
    if (subCatDesc !== "") {
      searchObject["subCatDesc"] = new RegExp(subCatDesc, "i");
    }
    let subCategoryData = await subcategoryModel
      .find(searchObject)
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .populate("parentCategoryId", "categoryName");
    let totalPageNumber = await subcategoryModel.find(searchObject);
    let allPage = Math.ceil(totalPageNumber.length / limit);
    res.status(200).json({
      status: 1,
      path: process.env.SUBCATEGORY_STATIC_PATH,
      datalist: subCategoryData,
      allPage,
      limit,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error !",
      error: error.message,
    });
  }
};

let subCategorySingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    const subCategoryData = await subcategoryModel.findOne({ _id: id });
    if (subCategoryData) {
      let imageName = await subCategoryData.subCategoryImage;
      let path = "uploads/subCategory/" + imageName;
      fs.unlinkSync(path);
      let singleRowDelete = await subcategoryModel.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
      res.status(200).json({
        status: 1,
        message: "Record deleted.",
        res: singleRowDelete,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Internal server error.",
      error:error.message,
    });
  }
};

let subCategoryMultipleDelete=async (req,res)=>{
  try{
  let {ids}=req.body
  let singleRowDelete;
  for(let id of ids){
    const subCategoryData = await subcategoryModel.findOne({ _id: id });
    if (subCategoryData) {
      let imageName = await subCategoryData.subCategoryImage;
      let path = "uploads/subCategory/" + imageName;
      fs.unlinkSync(path);
      singleRowDelete = await subcategoryModel.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
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
    res: singleRowDelete,
  });
}
catch(error){
  res.status(500).json({
    status: 0,
    message: "Internal server error.",
    error:error.message,
  });
}
}

let subCategoryEditRowData=async (req,res)=>{
  try{
  let id=req.params.id
  let subCategoryData=await subcategoryModel.findOne({_id:id})
  if(subCategoryData){
    return res.status(200).json({
      status:1,
      message:"Record found",
      path:process.env.SUBCATEGORY_STATIC_PATH,
      res:subCategoryData
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

let subCategoryUpdateRow=async (req,res)=>{
  try{
    let id=req.params.id
  let {subCategoryName, parentCategoryId, subcatDescription, subCategoryStatus}=req.body
  let subCategoryData={
    subCategoryName:subCategoryName,
    parentCategoryId:parentCategoryId,
    subcatDescription:subcatDescription,
    subCategoryStatus:subCategoryStatus,
    slug:myslug(req.body.subCategoryName)

  }
  if(req.file){
    if(req.file.filename){
      subCategoryData['subCategoryImage']=req.file.filename
    }
  }
  let subCategoryUpdate=await subcategoryModel.updateOne({_id:id}, {$set:subCategoryData})
  res.status(200).json({
    status:1,
    message:"Record Updated.",
    res:subCategoryUpdate
  })
}
catch(error){
  res.status(500).json({
    status: 0,
    message: "Server error occurred.",
    error: error.message,
  });
}
}

module.exports = {
  subCategoryInsert,
  parentCategoryView,
  subCategoryView,
  subCategorySingleDelete,
  subCategoryMultipleDelete,
  subCategoryEditRowData,
  subCategoryUpdateRow
};
