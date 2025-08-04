import { db } from "../db/db";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken"

/*export interface CustomRequest extends Request {
    token: string | JwtPayload
}
    */
interface DecodedToken {
    iduser: string
}/*
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
}*/
class AuthMiddleware {
    static authenticateUser = (req:Request, res:Response, next:NextFunction) => {
        const token = req.cookies.accessToken;

        if(!token){
            res.status(401).json({
                error: "No autorizado",
            });
            return;
        }
        try {
            // Verificar el token usando clave secreta del entorno
            const decodedToken = jwt.verify(token, process.env.SECRET_KEY ? process.env.SECRET_KEY : '') as DecodedToken
            (req as any).iduser = decodedToken.iduser;
            next();
        } catch (error) {
            console.error("La autenticación falló", error);
            res.status(401).json({
                message:"No autorizado"
            });
            return;
        }
    }
    static refreshTokenValidation = (req:Request, res: Response, next:NextFunction) => {
        // Extraer el refresh token del cookie HttpOnly
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            res.status(401).json({
                message: "No se suministro un token de actualización"
            });
            return;
        }
        try {
            const decodedToken = jwt.verify(refreshToken, process.env.SECRET_KEY ? process.env.SECRET_KEY : '') as DecodedToken
            (req as any).iduser = decodedToken.iduser

            next();

        } catch (error) {
            console.error("La autenticación con token de acutualizado falló", error);
            res.status(401).json({
            message:"No autorizado"
            });
            return;
        }
    };
}

export default AuthMiddleware