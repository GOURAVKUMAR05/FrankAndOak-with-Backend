const express=require("express")
const { sendOTP, checkOTPandRegister, login, googleLogin,  } = require("../../../controller/website/auth/websiteAuthController")
const websiteAuthRoute=express.Router()


websiteAuthRoute.post("/generate-otp",sendOTP)
websiteAuthRoute.post("/check-otp-register",checkOTPandRegister)
websiteAuthRoute.post("/login",login)
websiteAuthRoute.post("/google-login",googleLogin)

module.exports={websiteAuthRoute}