const express=require("express")
const { categoryRoute } = require("./admin/categoryRoutes")
const { sizeRoute } = require("./admin/sizeRoutes")
const { storyRoute } = require("./admin/storyRoutes")
const { sliderRoute } = require("./admin/sliderRoutes")
const { colorRoute } = require("./admin/colorRoutes")
const { subCategoryRoute } = require("./admin/subCategoryRoutes")
const { productRoute } = require("./admin/productRoutes")
const { adminAuthRoute } = require("./admin/auth/adminAuthRoute")
const { profileRoute } = require("./admin/auth/profileRoute")
const verifyToken = require("../middleware/verifyToken")
const adminRoute=express.Router()

adminRoute.use("/auth",adminAuthRoute)


adminRoute.use("/profile",profileRoute)
adminRoute.use("/category",verifyToken,categoryRoute)
adminRoute.use("/size",sizeRoute)
adminRoute.use("/story",storyRoute)
adminRoute.use("/slider",sliderRoute)
adminRoute.use("/color",colorRoute)
adminRoute.use("/sub-category",subCategoryRoute)
adminRoute.use("/product",productRoute)

module.exports={adminRoute}