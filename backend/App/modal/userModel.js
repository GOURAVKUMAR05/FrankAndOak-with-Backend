let mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName:String,
    lastName:String,
    userEmail: {
      type: String,
      unique: true,
      required:true
    },
    userPassword: {
      type:String,
    },
    userGender:{
        type: String,
        enum: [1, 2, 3], 
        default:3
    },
    
   
  },
  { timestamps: true }
);

let userModal = mongoose.model("user", userSchema);

module.exports = { userModal };
