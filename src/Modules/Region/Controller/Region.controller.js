import regionModel from "../../../../DB/model/Region.model.js";
import countryModel from "../../../../DB/model/Country.model.js";
// import cloudinary from "../../../Services/cloudinary.js";
// import slugify from "slugify";
export const createRegion = async(req,res,next)=>{
    const {name, lat, lng, zipCode} = req.body;
    const {countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }
    // const slug = slugify(name)
    if(await regionModel.findOne({name})){
        return next(new Error("duplicated region name",{cause:409}));
    }
    // const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/region`});
    // const region = await regionModel.create({name,slug,image:{
    //     public_id,secure_url  
    // }})
    const region = await regionModel.create({zipCode, name,lat,lng, createdBy:req.user._id, updatedBy:req.user._id, countryId, cityId});
    return res.status(201).json({message:'success',region});
}

export const updateRegion = async (req, res, next) => {
    const {name,lng,lat, zipCode} = req.body;
    const {regionId} = req.params;
    const {countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }

    if(!name && !lng && !lat && !zipCode) {
        return next(new Error('nothing to update',{cause:400}));
    }
    const region = await regionModel.findOne({_id:regionId, countryId, cityId},{...req.body, updatedBy:req.user._id},{new:true});
    if(!region) {
        return next(new Error('no region found',{cause:404}));
    }
    return res.status(200).json({message:'success', region});
}

export const deleteRegion = async (req,res,next)=>{
    const {regionId} = req.params;
    const {countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }   
    const region = await regionModel.findOneAndRemove({_id:regionId, countryId, cityId});
    if(!region) {
        return next(new Error('no region found',{cause:404}));
    }
    return res.status(200).json({message:'success', region});
}

export const getRegion = async (req,res,next)=>{
    const {regionId, countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }
    const region = await regionModel.findOne({_id:regionId, countryId, cityId});
    if(!region) {
        return next(new Error('no region found',{cause:404}));
    }
    return res.status(200).json({message:'success', region});
}

export const getRegions = async (req,res,next)=>{
    const regions = await regionModel.find();
    if(!regions) {
        return next(new Error('no regions found',{cause:404}));
    }
    return res.status(200).json({message:'success', regions});
}

export const getRegionsInCity = async (req,res,next)=>{
    const {countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }
    const regions = await regionModel.find({countryId, cityId});
    if(!regions) {
        return next(new Error('no regions found',{cause:404}));
    }
    return res.status(200).json({message:'success', regions});
}