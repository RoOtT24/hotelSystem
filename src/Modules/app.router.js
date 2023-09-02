
import connectDB from '../../DB/connection.js';
import { globalErrorHandel } from '../Services/errorHandling.js';
import AuthRouter from './Auth/Auth.router.js';
import UserRouter from './User/User.router.js';
import CountryRouter from "./Country/Country.router.js";
import CityRouter from "./City/City.router.js";
import RegionRouter from "./Region/Region.router.js";
import HotelRouter from "./Hotel/Hotel.router.js";
import RoomRouter from "./Room/Room.router.js";
import ReservationRouter from "./Reservation/Reservation.router.js";
import CouponRouter from "./Coupon/Coupon.router.js";
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
    app.use('/room',RoomRouter);
    app.use('/reservation',ReservationRouter);
    app.use('/coupon',CouponRouter);
    app.use('/*', (req,res)=>{
        return res.status(404).json({message:'page not found'});
    })

    //global error handler
    app.use(globalErrorHandel)

}

export default initApp;