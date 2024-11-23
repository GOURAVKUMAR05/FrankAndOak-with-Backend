const express=require("express")
const { sizeInsert, sizeView, sizeSingleDelete, sizeMultipleDelete, sizeEditRowData, sizeUpdateRowData } = require("../../controller/admin/sizeController")
const sizeRoute=express.Router()

sizeRoute.post("/insert",sizeInsert)
sizeRoute.get("/view",sizeView)
sizeRoute.delete("/delete/:id",sizeSingleDelete)
sizeRoute.post("/multiple-delete",sizeMultipleDelete)
sizeRoute.get("/editrow/:id",sizeEditRowData)
sizeRoute.put("/updaterow/:id",sizeUpdateRowData)
module.exports={sizeRoute}