const { myslug } = require("../../config/slugConfig");
const { storyModal } = require("../../modal/admin/storyModal");
const fs = require("fs");
let storyInsert = async (req, res) => {
  console.log(req.body);
  console.log(req.files);
  let { storyName, storyDescription, storyStatus } = req.body;
  let storyData = {
    storyName: storyName,
    storyDescription: storyDescription,
    storyStatus: storyStatus,
    slug:myslug(req.body.storyName)
  };
  if (req.files) {
    if (req.files.storyImage[0].filename) {
      storyData["storyImage"] = req.files.storyImage[0].filename;
    }
    if (req.files.bannerImage[0].filename) {
      storyData["bannerImage"] = req.files.bannerImage[0].filename;
    }
  }
  const storyCollection = new storyModal(storyData);
  try {
    const storyRes = await storyCollection.save();
    let response = {
      status: 1,
      message: "Data saved.",
      res: storyRes,
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

let storyView = async (req, res) => {
  let { storyName, storyDescription, pageNumber } = req.query;
  let searchObject = {};
  let limit = 5;
  if (storyName !== "") {
    searchObject["storyName"] = new RegExp(storyName, "i");
  }
  if (storyDescription !== "") {
    searchObject["storyDescription"] = new RegExp(storyDescription, "i");
  }
  let storyData = await storyModal
    .find(searchObject)
    .skip((pageNumber - 1) * limit)
    .limit(limit);
  let totalPageNumber = await storyModal.find(searchObject);
  let allPage = Math.ceil(totalPageNumber.length / limit);
  res.status(200).json({
    status: 1,
    path: process.env.STORY_STATIC_PATH,
    dataList: storyData,
    allPage,
    limit,
  });
};

let storySingleDelete = async (req, res) => {
  try {
    let id = req.params.id;
    let storyData = await storyModal.findOne({ _id: id });
    if (storyData) {
      let storyImage = await storyData.storyImage;
      let bannerImage = await storyData.bannerImage;
      // console.log(storyImage)
      // console.log(bannerImage)
      let storyFinalPath = "uploads/story/" + storyImage;
      let bannerFinalPath = "uploads/story/" + bannerImage;
      fs.unlinkSync(storyFinalPath);
      fs.unlinkSync(bannerFinalPath);
      let storyDelete = await storyModal.deleteOne({ _id: id });
      if (storyDelete.deletedCount === 0) {
        return res.status(200).json({
          status: 0,
          message: "No record found to delete.",
        });
      }
      res.status(200).json({
        status: 1,
        message: "Record Deleted",
        res: storyDelete,
      });
    }
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let storyMultipleDelete = async (req, res) => {
  try {
    let { ids } = req.body;
    let storyDelete;
    for (let id of ids) {
      let storyData = await storyModal.findOne({ _id: id });
      if (storyData) {
        let storyImage = await storyData.storyImage;
        let storyBanner = await storyData.bannerImage;
        let storyFinalPath = "uploads/story/" + storyImage;
        let bannerFinalPath = "uploads/story/" + storyBanner;
        fs.unlinkSync(storyFinalPath);
        fs.unlinkSync(bannerFinalPath);
        storyDelete = await storyModal.deleteOne({ _id: id });
        if (storyDelete.deletedCount === 0) {
          return res.status(200).json({
            status: 0,
            message: "No record found to delete.",
          });
        }
      }
    }
    res.status(200).json({
      status: 1,
      message: "Record Deleted",
      res: storyDelete,
    });
  } catch (error) {
    res.status(200).json({
      status: 0,
      message: "Server error occurred",
      error: error.message,
    });
  }
};

let storyEditRowData = async (req, res) => {
  try {
    let id = req.params.id;
    let storyData = await storyModal.findOne({ _id: id });
    if (storyData) {
      return res.status(200).json({
        status: 1,
        message: "Record found.",
        path: process.env.STORY_STATIC_PATH,
        res: storyData,
      });
    }
    return res.status(200).json({
      status: 0,
      message: "No record found.",
    });
  } catch (error) {
    return res.status(200).json({
      status: 0,
      message: "Server error occurred.",
      error: error.message,
    });
  }
};

let storyUpdateRowData = async (req, res) => {
  try {
    let id = req.params.id;
    // console.log(req.body)
    let storyData = {
      storyName: req.body.storyName,
      storyDescription: req.body.storyDescription,
      storyStatus: req.body.storyStatus,
      slug:myslug(req.body.storyName)
    };
    if (req.files) {
      if (req.files.storyImage) {
        storyData["storyImage"] = req.files.storyImage[0].filename;
      }
      if (req.files.bannerImage) {
        storyData["bannerImage"] = req.files.bannerImage[0].filename;
      }
    }

    let storyUpdate = await storyModal.updateOne(
      { _id: id },
      { $set: storyData }
    );
    res.status(200).json({
      status: 1,
      message: "Record Updated.",
      res: storyUpdate,
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
  storyInsert,
  storyView,
  storySingleDelete,
  storyMultipleDelete,
  storyEditRowData,
  storyUpdateRowData,
};
