import mongoose, {Schema,Types,model} from 'mongoose';
const citySchema = new Schema ({
    name:{
        type:String,
        required:true,
        unique:true,
    },
    slug:{
        type:String,
        required:true,
    },
    createdBy:{
        type:
            Types.ObjectId, 
            ref:'User',
            required:true,
    }, 
    updatedBy:{
        type:
            Types.ObjectId, 
            ref:'User',
            required:true,
    }, 
    countryId:{
        type:Types.ObjectId,
        ref:'User',
        required:true
    },
    lat:{
        type:Types.Decimal128,
        required:true,
    },
    lng:{
        type:Types.Decimal128,
        required:true,
    },
},
{
    timestamps:true
})
const cityModel = mongoose.models.City ||  model('City', citySchema);
export default cityModel;