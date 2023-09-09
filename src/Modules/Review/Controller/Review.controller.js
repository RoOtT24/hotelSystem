import reservationModel from "../../../../DB/model/Reservation.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createReview = async (req, res, next) => {
  const { roomId } = req.params;
  const {goodReview , badReview, location, valueForMoney, comfort, cleanliness, facilities, staff} = req.body;
  const reservation = await reservationModel.findOne({userId: req.user._id, roomId}).populate('Room');
  
  if(!reservation){
    return next(new Error(`no reservation to review!`, {cause:404}))
  }

  const checkReview = await reviewModel.findOne({createdBy: req.user._id, hotelId:reservation.roomId});
  if(checkReview){
    return next(new Error(`can not review this hotel again`, {cause:400}));
  }
  const rating = (location + valueForMoney + facilities + staff + comfort + cleanliness + facilities) / 7.0;
  const review = await reviewModel.create({createdBy:req.user._id, updatedBy:req.user._id, location , valueForMoney , facilities , staff , comfort , cleanliness , facilities, rating, goodReview , badReview, hotelId:'64f3969e205cac8f0b416aca', userId:req.user._id})

  return res.status(201).json({ message: "success", review });
};

export const updateReview = async (req, res, next) => {
  const {productId, reviewId} = req.params;
  const review = await reviewModel.findOneAndUpdate({_id: reviewId, productId}, req.body, {new:true})
  return res.status(200).json({ message: "success", review });
}

export const getReviews = async (req,res,next)=>{
  const { page, size } = req.query;
  const {hotelId} = req.params;
  const ecxQueryParams = ["page", "size"];
  const skip = ((page ?? 1) - 1) * (size || 5);
   req.body.reviews = await reviewModel.find({hotelId}).limit(size || 5).skip(skip);
  return res.status(200).json({message:'success', reviews:req.body.reviews});
}