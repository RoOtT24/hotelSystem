import countryModel from "../../../../DB/model/Country.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";
export const createCountry = async(req,res,next)=>{
    const {name} = req.body;
    const slug = slugify(name)
    if(await countryModel.findOne({name})){
        return next(new Error("duplicated country name",{cause:409}));
    }
    const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/country`});
    const country = await countryModel.create({name,slug,image:{
        public_id,secure_url  
    }})
    return res.status(201).json({message:'success',country});
}