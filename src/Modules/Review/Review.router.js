import { Router } from "express";
import fileUpload, { fileValidation } from "../../Services/multerCloudinary.js";
import * as reviewController from './Controller/Review.controller.js';
import * as validators from './Review.validation.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import validation from "../../Middleware/validation.js";
import { auth, roles } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Review.EndPoint.js";
const router = Router({mergeParams:true});

router.post('/:roomId', auth(endPoint.create), fileUpload(fileValidation.image).fields([{name:'images', maxCount:10}]), validation(validators.createReview), asyncHandler(reviewController.createReview));
router.get('/:hotelId', validation(validators.getReviews), asyncHandler(reviewController.getReviews));
router.delete('/:reviewId', auth(), validation(validators.getReviews), asyncHandler(reviewController.getReviews));

export default router;