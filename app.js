const Razorpay = require('razorpay');

// -------------------- Third Party provide secret key and id -----------------
var instance = new Razorpay({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});

const hmac_sha256 = require("crypto-js/hmac-sha256");

exports.createOrder = async (response, options) => {
  await instance.orders.create(options, (error, res) => {
    if (error) {
      console.log(error);
      return response.status(500).json({
        messgae: "Sorry Could not initailte the payment",
        status: 500,
      });
    } else {
      return response.status(200).json({
        order_id: res.id,
        currency: res.currency,
        amount: res.amount,
      });
    }
  });
};

exports.initiateRefund = async (req, response, pymt) => {
  const payment_id = pymt.payment_id;
  const amount = pymt.amount * 100;
  console.log(amount);
  await instance.payments.refund(payment_id, { amount }, (error, res) => {
    if (error) {
      console.log(error);
    } else {
      return response.status(200).json({
        amount: amount,
        payment_id: payment_id,
        message: "Refund Initiated",
        data: res,
        status: 200,
      });
    }
  });
};

exports.verifySignature = async (req, res) => {
  generated_signature = hmac_sha256(
    req.body.order_id + "|" + req.body.razorpay_payment_id,
    "RBxGSSxL24ZprJc9QqK4EezD"
  );
  if (generated_signature == req.body.razorpay_signature) {
    console.log("payment is successful");
  }
  return res.status(200).json({
    order_id: req.body.order_id,
    razorpay_payment_id: req.body.razorpay_payment_id,
  });
};

exports.errorHandler = (res, error, message, code) => {
  console.log("ERROR: " + error.message);
  response = {
    error: error.message,
    details: error,
    message: message,
  };
  return res.status(code || 500).json(response);
};
