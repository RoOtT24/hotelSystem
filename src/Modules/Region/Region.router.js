import { Router } from "express";
import * as regionController from './Controller/Region.controller.js';
import { asyncHandler } from "../../Services/errorHandling.js";
import * as validators from './Region.validation.js';
import validation from "../../Middleware/validation.js";
import { auth } from "../../Middleware/auth.middleware.js";
import { endPoint } from "./Region.EndPoint.js";
asyncHandler
const router = Router({mergeParams:true});
router.post('/', auth(endPoint.create), validation(validators.createRegion),asyncHandler(regionController.createRegion));
router.put('/:regionId', auth(endPoint.update), validation(validators.updateRegion),asyncHandler(regionController.updateRegion));
router.delete('/:regionId', auth(endPoint.delete), validation(validators.deleteRegion),asyncHandler(regionController.deleteRegion));
router.get('/one/:regionId', auth(endPoint.get), validation(validators.getRegion),asyncHandler(regionController.getRegion));
router.get('/', auth(endPoint.get), validation(validators.getRegions),asyncHandler(regionController.getRegions));
router.get('/inCity/:countryId', auth(endPoint.get), validation(validators.getRegionsInCity),asyncHandler(regionController.getRegionsInCity));
export default router;