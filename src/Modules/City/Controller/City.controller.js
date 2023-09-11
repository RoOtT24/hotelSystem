import cityModel from "../../../../DB/model/City.model.js";
import countryModel from "../../../../DB/model/Country.model.js";


export const createCity = async(req,res,next)=>{
    const {name, lat, lng} = req.body;
    const {countryId} = req.params;

    const country = countryModel.findById(countryId);
    if(!country){
        return next(new Error('no country found', {cause:404}));
    }
    // const slug = slugify(name)
    if(await cityModel.findOne({name})){
        return next(new Error("duplicated city name",{cause:409}));
    }
    // const{public_id,secure_url}=await cloudinary.uploader.upload(req.file.path,{folder:`${process.env.APP_NAME}/city`});
    // const city = await cityModel.create({name,slug,image:{
    //     public_id,secure_url  
    // }})
    const city = await cityModel.create({name,lat,lng, createdBy:req.user._id, updatedBy:req.user._id, countryId});
    return res.status(201).json({message:'success',city});
}

export const updateCity = async (req, res, next) => {
    const {name,lng,lat} = req.body;
    const {cityId} = req.params;
    const {countryId} = req.params;

    const country = countryModel.findById(countryId);
    if(!country){
        return next(new Error('no country found', {cause:404}));
    }

    if(!name && !lng && !lat) {
        return next(new Error('nothing to update',{cause:400}));
    }
    const city = await cityModel.findOneAndUpdate({_id:cityId, countryId},{...req.body, updatedBy:req.user._id},{new:true});
    if(!city) {
        return next(new Error('no city found',{cause:404}));
    }
    return res.status(200).json({message:'success', city});
}


export const deleteCity = async (req,res,next)=>{
    const {cityId} = req.params;
    const {countryId} = req.params;

    const country = countryModel.findById(countryId);
    if(!country){
        return next(new Error('no country found', {cause:404}));
    }
    const city = await cityModel.findOneAndRemove({_id:cityId, countryId});
    if(!city) {
        return next(new Error('no city found',{cause:404}));
    }
    return res.status(200).json({message:'success', city});
}

export const getCity = async (req,res,next)=>{
    const {cityId, countryId} = req.params;
    const country = countryModel.findById(countryId);
    if(!country){
        return next(new Error('no country found', {cause:404}));
    }
    const city = await cityModel.findOne({_id:cityId, countryId});
    if(!city) {
        return next(new Error('no city found',{cause:404}));
    }
    return res.status(200).json({message:'success', city});
}

export const getCities = async (req,res,next)=>{
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
     req.body.cities = await cityModel.find({}).limit(size || 5).skip(skip).sort(sort?.replaceAll(','," "));
    // if(!cities) {
    //     return next(new Error('no cities found',{cause:404}));
    // }
    if(search)
    req.body.cities = await req.body.cities.find({name:{$regex:name, $options:"i"}})
    return res.status(200).json({message:'success', cities:req.body.cities});
}

export const getCitiesInCountry = async (req,res,next)=>{
    const {countryId} = req.params;

    const { page, size } = req.query;
  const skip = ((page ?? 1) - 1) * (size || 5);

    const country = countryModel.findById(countryId).limit(size || 5).skip(skip);
    if(!country){
        return next(new Error('no country found', {cause:404}));
    }
    const cities = await cityModel.find({countryId});
    if(!cities) {
        return next(new Error('no cities found',{cause:404}));
    }
    return res.status(200).json({message:'success', cities});
}


