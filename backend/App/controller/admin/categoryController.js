const { categoryModel } = require("../../modal/admin/categoryModal");
const { myslug } = require("../../config/slugConfig");
fs = require("fs");
let categoryInsert = async (req, res) => {
  let { categoryName, categoryDescription, categoryStatus } = req.body;
  let categoryData = {
    categoryName: categoryName,
    categoryDescription: categoryDescription,
    categoryStatus: categoryStatus,
    slug:myslug(categoryName)
  };
  if (req.file) {
    if (req.file.filename) {
      categoryData["categoryImage"] = req.file.filename;
    }
  }

  const categoryCollection = new categoryModel(categoryData); // Create Collection in DB
  try {
    let catRes = await categoryCollection.save();
    let response = {
      status: 1,
      message: "Data Saved",
      res: catRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Category Already Exists !",
      res: error,
    };
    res.send(response);
  }
};

let categoryView = async (req, res) => {
  let searchObject = {};
  let { catName, catDesc , pageNumber } = req.query;
  let limit=5;
  // console.log(req.query);
  if (catName !== "") {
    searchObject["categoryName"] = new RegExp(catName, "i");
  }
  if (catDesc !== "") {
    searchObject["categoryDescription"] = new RegExp(catDesc, "i");
  }
  const categoryData = await categoryModel.find(searchObject).skip((pageNumber-1)*limit).limit(limit);
  
  const totalPageNumber=await categoryModel.find(searchObject)
  let allPage=Math.ceil(totalPageNumber.length/limit)
  let response = {
    status: 1,
    path: process.env.CATEGORY_STATIC_PATH,
    dataList: categoryData,
    allPage,
    limit
  };
  res.status(200).json(response);
};

let singleCategoryDelete = async (req, res) => {
  try {
    let ID = req.params.id;
    const categoryData = await categoryModel.findOne({ _id: ID });
    if (categoryData) {
      let imageName = await categoryData.categoryImage;
      let path = "uploads/category/" + imageName;
      fs.unlinkSync(path);

      let deleteSingleRow = await categoryModel.deleteOne({ _id: ID });
      if (deleteSingleRow.deletedCount == 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
      res.status(200).json({
        status: 1,
        message: "Data deleted.",
        res: deleteSingleRow,
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
    });
  }
};

let multipleCategoryRowDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let deleteSingleRow;
    for (ID of ids) {
      const categoryData = await categoryModel.findOne({ _id: ID });
      if (categoryData) {
        let imageName = await categoryData.categoryImage;
        let path = "uploads/category/" + imageName;
        fs.unlinkSync(path);

        deleteSingleRow = await categoryModel.deleteOne({ _id: ID });
        if (deleteSingleRow.deletedCount == 0) {
          res.status(404).json({
            status: 0,
            message: "No record found to delete.",
          });
        }
      }
    }
    res.status(200).json({
      status: 1,
      message: "Data deleted.",
      res: deleteSingleRow,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
    });
  }
};

let editRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let categoryData = await categoryModel.findOne({ _id: id });
    if (categoryData) {
      res.status(200).json({
        status: 1,
        message: "Record found to update",
        path: process.env.CATEGORY_STATIC_PATH,
        res: categoryData,
      });
    } else {
      res.status(404).json({
        status: 0,
        message: "No Record found to update",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let updateRowData = async (req, res) => {
  let id = req.params.id;
  let { categoryName, categoryDescription, categoryStatus } = req.body;
  let categoryData = {
    categoryName: categoryName,
    categoryDescription: categoryDescription,
    categoryStatus: categoryStatus,
    slug:myslug(categoryName)
  };
  if (req.file) {
    if (req.file.filename) {
      categoryData["categoryImage"] = req.file.filename;
    }
  }

  let updateData = await categoryModel.updateOne(
    { _id: id },
    { $set: categoryData }
  );
  res.status(200).json({
    status: 1,
    message: "Record Updated",
    res: updateData,
  });
};
module.exports = {
  categoryInsert,
  categoryView,
  singleCategoryDelete,
  multipleCategoryRowDelete,
  editRowData,
  updateRowData,
};
