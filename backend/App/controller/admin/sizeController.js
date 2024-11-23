const { myslug } = require("../../config/slugConfig");
const { sizeModal } = require("../../modal/admin/sizeModal");

let sizeInsert = async (req, res) => {
  let sizeData = {
    sizeName: req.body.sizeName,
    sizeStatus: req.body.sizeStatus,
    slug:myslug(req.body.sizeName)
  };
  const sizeCollection = new sizeModal(sizeData);
  try {
    let sizeRes = await sizeCollection.save();
    let response = {
      status: 1,
      message: "Data Saved.",
      res: sizeRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Size already Exists !",
      error: error,
    };
    res.send(response);
  }
};

let sizeView = async (req, res) => {
  let searchObject={}
  let limit=5
  let {sizeName, pageNumber}=req.query
  if(sizeName!==""){
    searchObject['sizeName']=new RegExp(sizeName,"i")
  }
  const sizeData = await sizeModal.find(searchObject).skip((pageNumber-1)*limit).limit(limit);
  const totalPageNumber=await sizeModal.find(searchObject)
  let allPage=Math.ceil(totalPageNumber.length/limit)
  let response = {
    status: 1,
    dataList: sizeData,
    allPage
  };
  res.status(200).json(response);
};

let sizeSingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let singleRowDelete = await sizeModal.deleteOne({ _id: id });
    if (singleRowDelete.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "No record found to delete.",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted",
      res: singleRowDelete,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sizeMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      singleRowDelete = await sizeModal.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted",
      res: singleRowDelete,
    });
  } catch (error) {
    return res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sizeEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let sizeData = await sizeModal.findOne({ _id: id });
    if (sizeData) {
      return res.status(200).json({
        status: 1,
        message: "Record found.",
        res: sizeData,
      });
    }
    res.status(404).json({
      status: 0,
      message: "No record found.",
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let sizeUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let sizeData = {
      sizeName: req.body.sizeName,
      sizeStatus: req.body.sizeStatus,
      slug:myslug(req.body.sizeName)
    };
    let sizeUpdate = await sizeModal.updateOne({ _id: id }, { $set: sizeData });
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: sizeUpdate,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};
module.exports = {
  sizeInsert,
  sizeView,
  sizeSingleDelete,
  sizeMultipleDelete,
  sizeEditRowData,
  sizeUpdateRowData,
};
