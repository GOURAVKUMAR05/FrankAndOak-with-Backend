const { myslug } = require("../../config/slugConfig");
const { colorModal } = require("../../modal/admin/colorModal");

let colorInsert = async (req, res) => {
  let { colorCode, colorName, colorStatus } = req.body;
  let colorData = {
    colorName: colorName,
    colorCode: colorCode,
    colorStatus: colorStatus,
    slug:myslug(colorName)
  };
  const colorCollection = new colorModal(colorData);
  try {
    let colorRes = await colorCollection.save();
    let response = {
      status: 1,
      message: "Data saved.",
      res: colorRes,
    };
    res.send(response);
  } catch (error) {
    let response = {
      status: 0,
      message: "Color already exists !",
      error: error,
    };
    res.send(response);
  }
};

let colorView = async (req, res) => {
  let searchObject={}
  let limit=5
  let {colorName,colorCode,pageNumber}=req.query
  if(colorName!==""){
    searchObject['colorName']=new RegExp(colorName,"i")
  }
  if(colorCode!==""){
    searchObject['colorCode']=new RegExp(colorCode,"i")
  }
  const colorData = await colorModal.find(searchObject).skip((pageNumber-1)*limit).limit(limit);
  const totalPageNumber=await colorModal.find(searchObject)
  let allPage=Math.ceil(totalPageNumber.length/limit)
  let response = {
    status: 1,
    dataList: colorData,
    allPage,
  };
  res.status(200).json(response);
};

let colorSingleDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let singleRowDelete = await colorModal.deleteOne({ _id: id });
    if (singleRowDelete.deletedCount === 0) {
      return res.status(404).json({
        status: 0,
        message: "No record found to delete.",
      });
    }
    res.status(200).json({
      status: 1,
      message: "Data deleted.",
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

let colorMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let singleRowDelete;
    for (let id of ids) {
      singleRowDelete = await colorModal.deleteOne({ _id: id });
      if (singleRowDelete.deletedCount === 0) {
        return res.status(404).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record deleted.",
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

let colorEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let colorData = await colorModal.findOne({_id: id});
    if (colorData) {
      res.status(200).json({
        status: 1,
        message: "Record found to update",
        res: colorData,
      });
    } else {
      res.status(404).json({
        status: 0,
        message: "No record found to update",
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

let colorUpdateRowData=async (req,res)=>{
    let id=req.params.id
    let { colorCode, colorName, colorStatus } = req.body;
    let colorData = {
      colorName: colorName,
      colorCode: colorCode,
      colorStatus: colorStatus,
      slug:myslug(colorName)
    };
    let colorUpdate=await colorModal.updateOne({_id:id},{$set:colorData})
    res.status(200).json({
        status:1,
        message:"Record updated.",
        res:colorUpdate
    })
}
module.exports = {
  colorInsert,
  colorView,
  colorSingleDelete,
  colorMultipleDelete,
  colorEditRowData,
  colorUpdateRowData
};
