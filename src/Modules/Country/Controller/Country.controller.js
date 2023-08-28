import countryModel from "../../../../DB/model/Country.model.js";
// import cloudinary from "../../../Services/cloudinary.js";
// import slugify from "slugify";



export const createCountry = async(req,res,next)=>{
    const {name, lat, lng} = req.body;
    // const slug = slugify(name)
    if(await countryModel.findOne({name})){
        return next(new Error("duplicated country name",{cause:409}));
    }
    // const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/country`});
    // const country = await countryModel.create({name,slug,image:{
    //     public_id,secure_url  
    // }})
    const country = await countryModel.create({name,lat,lng, createdBy:req.user._id});
    return res.status(201).json({message:'success',country});
}


export const updateCountry = async (req, res, next) => {
    const {name,lng,lat} = req.body;
    const {countryId} = req.params;
    if(!name && !lng && !lat) {
        return next(new Error('nothing to update',{cause:400}));
    }
    const country = await countryModel.findByIdAndUpdate(countryId,{...req.body},{new:true});
    if(!country) {
        return next(new Error('no country found',{cause:404}));
    }
    return res.status(200).json({message:'success', country});
}


export const deleteCountry = async (req,res,next)=>{
    const {countryId} = req.params;
    const country = await countryModel.findByIdAndRemove(countryId);
    if(!country) {
        return next(new Error('no country found',{cause:404}));
    }
    return res.status(200).json({message:'success', country});
}

export const getCountry = async (req,res,next)=>{
    const {countryId} = req.params;
    const country = await countryModel.findById(countryId);
    if(!country) {
        return next(new Error('no country found',{cause:404}));
    }
    return res.status(200).json({message:'success', country});
}

export const getCountries = async (req,res,next)=>{
    const countries = await countryModel.find();
    if(!countries) {
        return next(new Error('no countries found',{cause:404}));
    }
    return res.status(200).json({message:'success', countries});
}


