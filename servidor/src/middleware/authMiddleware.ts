import { db } from "../db/db";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"

/*export interface CustomRequest extends Request {
    token: string | JwtPayload
}
    */
interface DecodedToken {
    iduser: string
}
export const verifyToken = async (req:Request, res:Response, next:NextFunction) => {
    const token = req.header("access-token")?.replace('Bearer ', '');
    try {
    if(!token){
        res.status(403).json({
            message: "No se encontró un token"
        });
        return;
    }
    const tokenDecoded = jwt.verify(token, process.env.SECRET_KEY ? process.env.SECRET_KEY : '') as DecodedToken;
    (req as any).iduser = tokenDecoded;
    const user = await db.user.findFirst({
        where: {
            iduser: tokenDecoded.iduser
        }
    });

    if(!user){
        res.status(404).json({
            message: "No se ha encontrado al usuario"
        });
        return;
    }
    next();
} catch (error){
        if(error instanceof TokenExpiredError){
            res.status(403).json({
                message: "El token de acceso ha expirado. Por favor vuelva a autenticarse"
            });
            return;
        }
        res.status(401).json({
            message: "Error de autenticación",
            error: error,
        });
        return;
    }
}