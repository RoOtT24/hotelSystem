import mongoose, {Schema,Types,model} from 'mongoose';
const countrySchema = new Schema ({
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
            ref:'User'
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
const countryModel = mongoose.models.Country ||  model('Country', countrySchema);
export default countryModel;