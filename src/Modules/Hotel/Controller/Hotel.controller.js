import hotelModel from "../../../../DB/model/Hotel.model.js";
import regionModel from "../../../../DB/model/Region.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createHotel = async(req,res,next)=>{
    const {name} = req.body;
    const { mainImage, subImages } = req.files;
    const {countryId, cityId, regionId} = req.params;

    const region = regionModel.findOne({countryId,_id:regionId, cityId});
    if(!region){
        return next(new Error('no city/country/region found', {cause:404}));
    }
    const slug = slugify(name);
    req.body.slug = slug;
    if(await hotelModel.findOne({name})){
        return next(new Error("duplicated hotel name",{cause:409}));
    }
    if (subImages) {
        req.body.subImages = [];
        for (const image of subImages) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            image.path,
            { folder: `${process.env.APP_NAME}/hotel/${slug}/subImages` }
          );
          req.body.subImages.push({ secure_url, public_id });
        }
      }
    
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        mainImage[0].path,
        { folder: `${process.env.APP_NAME}/hotel/${slug}/mainImage` }
      );
      req.body.mainImage = { secure_url, public_id };   
      req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id; 
    //   const hotel = await hotelModel.create({createdBy:req.user._id, updatedBy:req.user._id, lng, lat, cityId, countryId, regionId, name, slug, mainImage:{
    //     public_id,secure_url  
    // }});
    const hotel = await hotelModel.create({...req.body});
    return res.status(201).json({message:'success',hotel});
}

export const updateHotel = async (req, res, next) => {
    const {name,lng,lat} = req.body;
    const {hotelId} = req.params;
    const {countryId, cityId, regionId} = req.params;
    // const { mainImage, subImages } = req.files;

    const region = regionModel.findOne({countryId,_id:regionId, cityId});
    if(!region){
        return next(new Error('no city/country/region found', {cause:404}));
    }

    const hotel = await hotelModel.findOne({_id:hotelId, countryId, cityId});
    if(!hotel) {
        return next(new Error('no hotel found',{cause:404}));
    }
   if(name){
    if(name == hotel.name)
        return next(new Error('can not enter the same name', {cause:400}));
    if(await hotelModel.findOne(name))
        return next(new Error('duplicate hotel name', {cause:400}))
    hotel.name = name;
    hotel.slug = slugify(name);
   }
   if(lng || lat){
    if( (lng && hotel.lng== lng) || (lat && hotel.lat== lat))
        return next(new Error('can not enter the same lng or lat', {cause:400}));

   if(!lng){
        req.body.lng = hotel.lng;
   }
   else if(!lat){
        req.body.lat = hotel.lat;
   }
   const checkHotel = await hotelModel.findOne({lng:req.body.lng, lat:req.body.lat});
   if(checkHotel)
    return next(new Error('can not place a hotel on top of another hotel, double check lng and lat', {cause:400}));
   hotel.lat = req.body.lat;
   hotel.lng = req.body.lng;
}
const {slug} = hotel;
if (req.body.files) {
    if (req.body.files?.mainImage[0]) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `${process.env.APP_NAME}/hotel/${slug}/mainImage` }
      );
      await cloudinary.uploader.destroy(product.mainImage.public_id);
      product.mainImage = { secure_url, public_id };
    }
    if (req.body.files?.subImages) {
      for (const img in product.subImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      product.subImages = [];
      for (const img in req.body.files?.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          img.path,
          { folder: `${process.env.APP_NAME}/hotel/${slug}/subImages` }
        );
        product.subImages.push({ secure_url, public_id });
      }
    }
  }
    hotel.updatedBy = req.user._id;
    hotel.save();
    return res.status(200).json({message:'success', hotel});
}

export const deleteHotel = async (req,res,next)=>{
    const {hotelId} = req.params;
    const {countryId, cityId, regionId} = req.params;

    const region = regionModel.findOne({countryId,_id:regionId,cityId});
    if(!region){
        return next(new Error('no city/country/region found', {cause:404}));
    }   
    const hotel = await hotelModel.findOneAndRemove({_id:hotelId, countryId, cityId, regionId});
    if(!hotel) {
        return next(new Error('no hotel found',{cause:404}));
    }
    return res.status(200).json({message:'success', hotel});
}

export const getHotel = async (req,res,next)=>{
    const {hotelId, countryId, cityId, regionId} = req.params;

    const region = regionModel.findOne({countryId,_id:regionId, cityId});
    if(!region){
        return next(new Error('no city/country/region found', {cause:404}));
    }
  
    const hotel = await hotelModel.findOne({_id:hotelId, countryId, cityId, regionId}).populate('reviews');
    if(!hotel) {
        return next(new Error('no hotel found',{cause:404}));
    }
    return res.status(200).json({message:'success', hotel});
}

export const getHotels = async (req,res,next)=>{
    const hotels = await hotelModel.find().populate('reviews');
    if(!hotels) {
        return next(new Error('no hotels found',{cause:404}));
    }
    return res.status(200).json({message:'success', hotels});
}

export const getHotelsInCity = async (req,res,next)=>{
    const {countryId, cityId} = req.params;

    const city = cityModel.findOne({countryId,_id:cityId});
    if(!city){
        return next(new Error('no city/country found', {cause:404}));
    }
    const hotels = await hotelModel.find({countryId, cityId}).populate('reviews');
    if(!hotels) {
        return next(new Error('no hotels found',{cause:404}));
    }
    return res.status(200).json({message:'success', hotels});
}

export const getHotelsInRegion = async (req,res,next)=>{
    const {countryId, cityId, regionId} = req.params;

    const region = regionModel.findOne({countryId,_id:regionId, cityId}).populate('reviews');
    if(!region){
        return next(new Error('no city/country/region found', {cause:404}));
    }
    const hotels = await hotelModel.find({countryId, cityId, regionId});
    if(!hotels) {
        return next(new Error('no hotels found',{cause:404}));
    }
    return res.status(200).json({message:'success', hotels});
}
