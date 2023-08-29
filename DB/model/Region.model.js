import mongoose, {Schema,Types,model} from 'mongoose';

const regionSchema = new Schema ({
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
        ref:'Country',
        required:true
    },
    cityId:{
        type:Types.ObjectId,
        ref:'City',
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    lat:{
        type:Types.Decimal128,
        required:true,
    },
    lng:{
        type:Types.Decimal128,
        required:true,
    },
    zipCode:{
        type:Number,
        required:true,
    },

    
},
{
    timestamps:true
})
const regionModel = mongoose.models.Region ||  model('Region', regionSchema);
export default regionModel;