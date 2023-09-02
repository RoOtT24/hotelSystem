import roomModel from "../../../../DB/model/Room.model.js";
import regionModel from "../../../../DB/model/Region.model.js";
import hotelModel from "../../../../DB/model/Hotel.model.js";
import cloudinary from "../../../Services/cloudinary.js";
import slugify from "slugify";

export const createRoom = async (req, res, next) => {
  const { name } = req.body;
  const { mainImage, subImages } = req.files;
  const { countryId, cityId, regionId, hotelId } = req.params;

  const hotel = hotelModel.findOne({
    countryId,
    _id: hotelId,
    regionId,
    cityId,
  });
  if (!hotel) {
    return next(new Error("no hotel found in this area", { cause: 404 }));
  }
  const slug = slugify(name);
  req.body.slug = slug;
  if (await roomModel.findOne({ name })) {
    return next(new Error("duplicated room name", { cause: 409 }));
  }
  if (subImages) {
    req.body.subImages = [];
    for (const image of subImages) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        image.path,
        { folder: `${process.env.APP_NAME}/room/${slug}/subImages` }
      );
      req.body.subImages.push({ secure_url, public_id });
    }
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    mainImage[0].path,
    { folder: `${process.env.APP_NAME}/room/${slug}/mainImage` }
  );
  req.body.mainImage = { secure_url, public_id };
  req.body.createdBy = req.user._id;
  req.body.updatedBy = req.user._id;
  req.body.countryId = countryId
  req.body.cityId = cityId
  req.body.regionId = regionId
  req.body.hotelId = hotelId

  const room = await roomModel.create({ ...req.body });
  return res.status(201).json({ message: "success", room });
};

export const updateRoom = async (req, res, next) => {
  const { name } = req.body;
  const { roomId } = req.params;
  const { countryId, cityId, regionId, hotelId } = req.params;

  const hotel = hotelModel.findOne({
    countryId,
    _id: hotelId,
    regionId,
    cityId,
  });
  if (!hotel) {
    return next(new Error("no hotel found in this area", { cause: 404 }));
  }

  const room = await roomModel.findOne(
    { _id: roomId, countryId, cityId, regionId, hotelId });
  if (!room) {
    return next(new Error("no room found", { cause: 404 }));
  }
  if (name) {
    if (name == room.name)
      return next(new Error("can not enter the same name", { cause: 400 }));
    if (await roomModel.findOne(name))
      return next(new Error("duplicate room name", { cause: 400 }));
    // room.name = name;
    req.body.slug = slugify(name)
  }
  else{
    req.body.slug = slugify(room.name);
  }
  const slug = req.body.slug;
  if (req.body.files) {
    if (req.body.files?.mainImage[0]) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `${process.env.APP_NAME}/room/${slug}/mainImage` }
      );
      await cloudinary.uploader.destroy(product.mainImage.public_id);
      req.body.mainImage = { secure_url, public_id };
    }
    if (req.body.files?.subImages) {
      for (const img in product.subImages) {
        await cloudinary.uploader.destroy(img.public_id);
      }
      req.body.subImages = [];
      for (const img in req.body.files?.subImages) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          img.path,
          { folder: `${process.env.APP_NAME}/room/${slug}/subImages` }
        );
        req.body.subImages.push({ secure_url, public_id });
      }
    }
  }
  req.body.updatedBy = req.user._id;
  const result = await roomModel.findOneAndUpdate(
    { _id: roomId, countryId, cityId, regionId, hotelId },
    { ...req.body}, {new:true}
  );
  return res.status(200).json({ message: "success", room:result });
};

export const deleteRoom = async (req, res, next) => {
  const { roomId } = req.params;
  const { countryId, cityId, regionId, hotelId } = req.params;

  const hotel = hotelModel.findOne({
    countryId,
    _id: hotelId,
    regionId,
    cityId,
  });
  if (!hotel) {
    return next(new Error("no hotel found in this area", { cause: 404 }));
  }
  const room = await roomModel.findOneAndRemove({
    _id: roomId,
    countryId,
    cityId,
    regionId,
    hotelId
  });
  if (!room) {
    return next(new Error("no room found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", room });
};

export const getRoom = async (req, res, next) => {
  const { countryId, cityId, regionId, hotelId, roomId } = req.params;

  const hotel = hotelModel.findOne({
    countryId,
    _id: hotelId,
    regionId,
    cityId,
  });
  if (!hotel) {
    return next(new Error("no hotel found in this area", { cause: 404 }));
  }

  const room = await roomModel.findOne({
    _id: roomId,
    countryId,
    cityId,
    regionId,
    hotelId
  });
  if (!room) {
    return next(new Error("no room found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", room });
};

export const getRooms = async (req, res, next) => {
  const rooms = await roomModel.find();
  if (!rooms) {
    return next(new Error("no rooms found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", rooms });
};

export const getRoomsInHotel = async (req, res, next) => {
  const { hotelId } = req.params;

  const hotel = hotelModel.findOne({  
    _id: hotelId,
  });
  if (!hotel) {
    return next(new Error("no hotel found in this area", { cause: 404 }));
  }
  const rooms = await roomModel.find({ hotelId });
  if (!rooms) {
    return next(new Error("no rooms found", { cause: 404 }));
  }
  return res.status(200).json({ message: "success", rooms });
};
