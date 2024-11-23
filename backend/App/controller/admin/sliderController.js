const { myslug } = require("../../config/slugConfig");
const { sliderModal } = require("../../modal/admin/sliderModal");
const fs = require("fs");
let sliderInsert = async (req, res) => {
  // console.log(req.body)
  // console.log(req.file)
  let { sliderName, sliderHeading, sliderSubHeading, sliderStatus } = req.body;
  let sliderData = {
    sliderName: sliderName,
    sliderHeading: sliderHeading,
    sliderSubHeading: sliderSubHeading,
    sliderStatus: sliderStatus,
    slug:myslug(req.body.sliderName)
  };
  if (req.file) {
    if (req.file.filename) {
      sliderData["sliderImage"] = req.file.filename;
    }
  }
  const sliderCollection = new sliderModal(sliderData);
  try {
    let sliderRes = await sliderCollection.save();
    let response = {
      status: 1,
      message: "Data saved.",
      res: sliderRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Data already exists !",
      error: error,
    };
    res.send(response);
  }
};

let sliderView = async (req, res) => {
  let {sliderName,sliderHeading, pageNumber}=req.query
  let searchObject={}
  let limit=5
  if(sliderName!==""){
    searchObject['sliderName']=new RegExp(sliderName,"i")
  }
  if(sliderHeading!==""){
    searchObject['sliderHeading']=new RegExp(sliderHeading,"i")
  }
  const sliderData = await sliderModal.find(searchObject).skip((pageNumber-1)*limit).limit(limit)
  const totalPageNumber=await sliderModal.find(searchObject)
  let allPage=Math.ceil(totalPageNumber.length/limit)
  let response = {
    status: 1,
    path: process.env.SLIDER_STATIC_PATH,
    dataList: sliderData,
    allPage,
    limit
  };
  res.status(200).json(response);
};

let sliderSingleDelete = async (req, res) => {
  try {
    let { id } = req.params;
    let sliderData = await sliderModal.findOne({ _id: id });
    if (sliderData) {
      let imageName = await sliderData.sliderImage;
      let path = "uploads/slider/" + imageName;
      fs.unlinkSync(path);
      let singleRowDelete = await sliderModal.deleteOne({ _id: id });
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
    return res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sliderMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      let sliderData = await sliderModal.findOne({ _id: id });
      if (sliderData) {
        let imageName = await sliderData.sliderImage;
        let path = "uploads/slider/" + imageName;
        fs.unlinkSync(path);
        singleRowDelete = await sliderModal.deleteOne({ _id: id });
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
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let sliderEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let sliderData = await sliderModal.findOne({ _id: id });
    if (sliderData) {
      return res.status(200).json({
        status: 1,
        message: "Record Found.",
        path: process.env.SLIDER_STATIC_PATH,
        res: sliderData,
      });
    }
    res.status(200).json({
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

let sliderUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let { sliderName, sliderHeading, sliderSubHeading, sliderStatus } =req.body;
    let sliderData = {
      sliderName: sliderName,
      sliderHeading: sliderHeading,
      sliderSubHeading: sliderSubHeading,
      sliderStatus: sliderStatus,
      slug:myslug(req.body.sliderName)
    };
    if (req.file) {
      if (req.file.filename) {
        sliderData["sliderImage"] = req.file.filename;
      }
    }
    let sliderUpdate = await sliderModal.updateOne(
      { _id: id },
      { $set: sliderData }
    );
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: sliderUpdate,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};
module.exports = {
  sliderInsert,
  sliderView,
  sliderSingleDelete,
  sliderMultipleDelete,
  sliderEditRowData,
  sliderUpdateRowData,
};
