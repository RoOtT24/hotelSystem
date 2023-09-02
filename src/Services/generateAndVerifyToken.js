import jwt from 'jsonwebtoken';

export const generateToken =(payload,signature=process.env.TOKEN_SIGNATURE,expiresIn=null)=>{

    const token = expiresIn?jwt.sign(payload,signature,{expiresIn}):jwt.sign(payload,signature);

    return token;
}

export const verifyToken = (token,signature=process.env.TOKEN_SIGNATURE)=>{

    const decoded = jwt.verify(token,signature);

    return decoded;
}