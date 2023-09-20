import User from "../models/user.model.js";
import { razorpay } from "../server.js";
import AppError from "../utils/error.utils.js";

const getRazorpayApiKey = async (req, res, next) => {
  res.status(200).json({
    sucess: true,
    message: "Razorpay API key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};

const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findByID(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login"));
    }

    if (user.role == "ADMIN") {
      return next(new AppError("ADMIN CANNOT PURCHASE A SUBSCRIPTION!!", 400));
    }

    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID,
      customer_notify: 1,
    });

    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Subscribe sucessfully",
      subscription_id: subscription.id,
    });
  } catch (e) {
    return next(new AppError(e.message, 400));
  }
};

const verifySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    } = req.boy;

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("Unauthorized, please Subscribe!!!"));
    }

    const subscriptionId = user.subscription.id;

    const generatedSignature = crypto
      .createHash("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_payment_id}|${subscriptionId}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return next(new AppError("Payment not verify, please try again", 500));
    }

    await Payment.create({
      razorpay_payment_id,
      razorpay_signature,
      razorpay_subscription_id,
    });

    user.subscription.status = "active";
    await user.save();

    res.status(200).json({
      sucess: true,
      message: "Payment verify sucessfully!!",
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

const cancleSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login"));
    }

    if (user.role == "ADMIN") {
      return next(new AppError("ADMIN CANNOT PURCHASE A SUBSCRIPTION!!", 400));
    }

    const subscriptionId = user.subscription.id;

    const subscription = await razorpay.subscriptions.cancel(subscriptionId);

    user.subscription.status = subscription.status;

    await user.save();
  } catch (e) {
    return next(new AppError(e.message, 400));
  }
};

const allPayment = async (req, res, next) => {
    try {
        const { count } = req.query;

        const allPayments = await razorpay.subscriptions.all({
            count: count || 10,
        });
    
        res.status(200).json({
            sucess: true,
            message: 'All message',
            allPayments
        })
    } catch (e) {
        return next(new AppError(e.message,500));
    }
};

export {
  getRazorpayApiKey,
  buySubscription,
  cancleSubscription,
  allPayment,
  verifySubscription,
};
