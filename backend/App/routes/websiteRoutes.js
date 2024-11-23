const express=require("express")


const { websiteAuthRoute } = require("./website/auth/websiteAuthRoute")
const { collectionRoutes } = require("./website/CollectionRoute")
const { productWebsiteRoute } = require("./website/productRoute")
const cartWebsiteRoute = require("./website/cartRoute")
const { forgetPassRoute } = require("./website/auth/forgetPassRoute")
const { orderWebsiteRoute } = require("./website/orderRoute")
const { wishlistWebsiteRoute } = require("./website/wishlistRoute")

const websiteRoute=express.Router()


websiteRoute.use("/collections",collectionRoutes)
websiteRoute.use("/auth",websiteAuthRoute)
websiteRoute.use("/products",productWebsiteRoute)
websiteRoute.use("/cart",cartWebsiteRoute)
websiteRoute.use("/forget-password",forgetPassRoute)
websiteRoute.use("/order",orderWebsiteRoute)
websiteRoute.use("/wishlist",wishlistWebsiteRoute)



module.exports={websiteRoute}