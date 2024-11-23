const { orderModal } = require("../../modal/orderModal");
const Razorpay = require("razorpay");
const crypto = require("crypto");

let instance = new Razorpay({
  key_id: "rzp_test_bQlyV7ucVx6ogo",
  key_secret: "yvogXUWbQBb9Fc35v9SV4loV",
});

let saveOrder = async (req, res) => {
  console.log(req.body);

  if (req.body.paymentType == 1) {
    let saveOrder = await orderModal(req.body);
    let data = await saveOrder.save();
    res.status(200).json({
      status: 1,
      data: data,
      message: "Order Placed.",
    });
  } else if (req.body.paymentType == 2) {
    let saveOrder = await orderModal(req.body);
    let data = await saveOrder.save(); //Insert
    // Razorpay Order Creating Start
    let orderData = {
      amount: Math.floor(req.body.orderAmount) * 100,
      currency: "INR",
      receipt: `order_rcptid_${data._id}`,
    };
    try {
      instance.orders.create(orderData, async function (err, order) {
        let orderID = order.id;
        let updateRazorpayOrderId = await orderModal.updateOne(
          // Update
          { _id: data._id },
          { $set: { razorpayOrderId: orderID } }
        );
        console.log(err);
        res.send(order);

        //Payment Pending
      });
    } catch (error) {
      console.log(error);
      res.status(400).send("Unable to create order");
    }
  } else {
    // Stripe payment integration
  }
};

let razorpayVerifyOrder = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", "yvogXUWbQBb9Fc35v9SV4loV")
    .update(sign.toString())
    .digest("hex");

  if (expectedSign == razorpay_signature) {
    //Payment Success
    let updateData = await orderModal.updateOne(
      { razorpayOrderId: razorpay_order_id }, //Condition
      {
        $set: {
          razorpayPaymentId: razorpay_payment_id,
          paymentStatus: 2,
          orderStatus: "Shipped",
        },
      }
    );
    res.status(200).json({
      status: 1,
      message: "Order Placed.",
      data: updateData,
    });
  } else {
    res.status(500).json({
      status: 0,
      message: "Transaction not verified.",
    });
  }
};

let viewOrder = async (req, res) => {
  try {
    let userId = req.params.id;
    let orderData = await orderModal.find({ user: userId });
    res.status(200).json({
      status: 1,
      data: orderData,
    });
  } catch (error) {
    res.status(500).json({
      status: 0,
      error: error.message,
    });
  }
};

let viewOrderDetail = async (req, res) => {
  try {
    let orderID = req.params.id;
    let orderData = await orderModal.findOne({ _id: orderID });
    if (orderData) {
      res.status(200).json({
        status: 1,
        path: process.env.PRODUCT_STATIC_PATH,
        data: orderData,
      });
    } else {
      res.status(200).json({
        status: 0,
        message: "Order not found.",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 0,
      message: "Server error occurred.",
    });
  }
};

let cancelOrder=async(req,res)=>{
  try{
  let {reason, comment, order, user}=req.body
  if(order){
  let cancelOrderData=await orderModal.updateOne({_id:order,user:user}, {$set:{paymentStatus:3, orderStatus:"Cancelled"}})
  res.status(200).json({
    status:1,
    message:"Order Cancelled.",
    data:cancelOrderData
  })
  }
  else{
    res.status(200).json({
      status:0,
      message:"Unable to cancel order."
    })
  }
  }
  catch(error){
    res.status(500).json({
      status:0,
      error:error.message
    })
  }
}

module.exports = { saveOrder, viewOrder, viewOrderDetail, razorpayVerifyOrder, cancelOrder };
