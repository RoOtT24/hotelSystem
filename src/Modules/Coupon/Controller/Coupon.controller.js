 import { request } from "express";
import couponModel from "../../../../DB/model/Coupon.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
import userModel from "../../../../DB/model/User.model.js";
import { sendEmail } from "../../../Services/sendEmail.js";

export const createCoupon = async (req, res, next) => {
  const name = req.body.name.toLowerCase();
  const {amount} = req.body;
  if (await couponModel.findOne({ name }))
    return next(new Error(`Duplicate coupon name`, { cause: 409 }));
    let now = new Date();
    let date = Date.parse(req.body.expireDate);
    if(now.getTime() >= date){
      return next(new Error('invalid date', {cause:400}))
    }
    const dateConvert = new Date(date).toLocaleDateString('en-US');
    // return res.json({date:dateConvert});
    req.body.expireDate = dateConvert//.toLocaleDateString();
  const coupon = await couponModel.create({
    name,
    amount,
    createdBy:req.user._id,
    updatedBy:req.user._id,
    expireDate:dateConvert
  });
  const users = await userModel.find({role:'User'});
  for(let i = 0; i < users.length; i++){
    sendEmail(users[i].email, 'new coupon!', `<p>coupon name: ${coupon.name}</p><br/> <p>id: ${coupon._id}</p><br/><p>expire date: ${dateConvert}</p>`);
  }
  return res.status(200).json({ message: "success", coupon });
// }
};

export const updateCoupon = async (req, res, next) => {
  console.log("req.body : ", req.body);
  const coupon = await couponModel.findById(req.params.couponId);
  if (!coupon)
    return next(
      new Error(`invalid coupon id ${req.params.catId}`, { cause: 400 })
    );

  if (req.body.name) {
    if (coupon.name === req.body.name.toLowerCase())
      return next(new Error(`old name matches the new name`, { cause: 409 }));
    if (await couponModel.findOne({ name: req.body.name }))
      return next(new Error(`Duplicate coupon name`, { cause: 409 }));
    console.log(req.body.name)
    coupon.name = req.body.name;
  }
  if(req.body.amount){
    if(coupon.amount === req.body.amount){
      return next(new Error(`same coupon amount`, { cause:409}));
    }
    coupon.amount = req.body.amount;
  }
  coupon.updatedBy = req.user._id;
  await coupon.save();
  return res.status(200).json({ message: "success", coupon });
}


export const getSpecificCoupon = async (req, res, next) => {
  const coupon = await couponModel.findById(req.params.couponId);
  if(!coupon)
    return res.status(404).json({ message: "no coupon found"});
  return res.status(200).json({message:"success", coupon});
}

export const getCoupons = async (req,res,next)=>{
  const { page, size, sort, search } = req.query;
  const ecxQueryParams = ["page", "size", "sort", "search"];
const filterQuery = { ...req.query };
ecxQueryParams.map((param) => {
  delete filterQuery[param];
});
const query = JSON.parse(
  JSON.stringify(filterQuery).replace(
    /(gt|gte|lt|lte|in|nin|eq|neq)/g,
    (match) => `$${match}`
  )
);
const {name} = query;
const skip = ((page ?? 1) - 1) * (size || 5);
   req.body.coupons = await couponModel.find({name}).limit(size || 5).skip(skip).sort(sort?.replaceAll(','," "));
  if(search)
  req.body.coupons = await req.body.coupons.find({name:{$regex:name, $options:"i"}})
  return res.status(200).json({message:'success', coupons:req.body.coupons});
}


export const deleteCoupon = async (req, res, next) => {
  let { couponId } = req.params;
  const coupon = await couponModel.findOneAndDelete({
    _id: couponId,
  });

  if (!coupon) {
    return next(new Error("no coupon found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", coupon });
};
