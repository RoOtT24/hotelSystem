
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CountryRouter from "./Country/Country.router.js";
import CityRouter from "./City/City.router.js";
import RegionRouter from "./Region/Region.router.js";
import HotelRouter from "./Hotel/Hotel.router.js";
import path from 'path'; 
import {fileURLToPath} from 'url';
import cors from 'cors';
 const __dirname = path.dirname(fileURLToPath(import.meta.url));
 const fullPath=path.join(__dirname,'../upload');

const initApp=(app,express)=>{
    app.use(cors());
    connectDB();
    app.use(express.json());
    app.use('/upload',express.static(fullPath));
    app.use("/auth", AuthRouter);
    app.use('/user', UserRouter);
    app.use('/country',CountryRouter);
    app.use('/city',CityRouter);
    app.use('/region',RegionRouter);
    app.use('/hotel',HotelRouter);
    app.use('/*', (req,res)=>{
        return next(new Error('page not found', {cause:404}));
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;