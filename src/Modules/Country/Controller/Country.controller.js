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
    
  const skip = ((page ?? 1) - 1) * (size || 5);
    const country = await countryModel.findById(countryId);
    if(!country) {
        return next(new Error('no country found',{cause:404}));
    }
    return res.status(200).json({message:'success', country});
}

export const getCountries = async (req,res,next)=>{
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
     req.body.countries = await countryModel.find({}).limit(size || 5).skip(skip).sort(sort?.replaceAll(','," "));
    // if(!countries) {
    //     return next(new Error('no countries found',{cause:404}));
    // }
    if(search)
    req.body.countries = await req.body.countries.find({name:{$regex:name, $options:"i"}})
    return res.status(200).json({message:'success', countries:req.body.countries});
}


