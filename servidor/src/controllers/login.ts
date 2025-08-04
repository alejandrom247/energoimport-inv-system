import {db} from "../db/db"
import {Request, Response} from "express";
import bcrypt from "bcrypt"
import { generateAccessToken } from "../util/generateJWT";
import { addMinutes } from "date-fns";
import { transporter } from "../util/nodemailer";
import generateResetPasswordEmail from "../util/generateEmailTemplate"
import jwt from "jsonwebtoken"
//import hbs from "nodemailer-express-handlebars"


export async function authenticateUser(req:Request, res:Response) {
    const { 
        email,
        username,
        password } = req.body

        try {
            const existingUser = await db.user.findFirst({
                where: {
                    OR: [{email: email}, {username: username}]
                }
            });
            if(!existingUser){
                res.status(403).json({
                    error: "Usuario o contraseña incorrectos",
                    data: null
                });
                return;
            }
            const passwordMatch = await bcrypt.compare(password, existingUser.password);
            if(!passwordMatch){
                res.status(403).json({
                    error: "Usuario o contraseña incorrectos",
                    data: null
                });
                return;
            }
            // Destructurar el password para que no sea transmitido al cliente
            const { password:noPassword, ...others} = existingUser
            const accessToken = generateAccessToken({iduser: others.iduser})
            const refreshToken = generateAccessToken({iduser: others.iduser}, { expiresIn: '24h'})
            await db.user.update({
                where: {
                 email,
                 username
                },
                data: {
                    refreshToken
                }
            })
            res.cookie("access-token", accessToken, {
                httpOnly: true,//Asegura que al cookie no se pueda acceder vía JavaScript (seguridad contra ataques tipo XSS)
                secure: process.env.NODE_ENV === "production", //Se coloca verdadero en producción para Cookies HTTPS-only
                maxAge: 15 * 60 * 1000, //15 minutos en milisegundos
                sameSite: "strict" //Se asegura que el cookie solo es enviado para peticiones del mismo dominio
            }).status(200);
            res.cookie("refresh-token", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
                sameSite: "strict"
            })
            res.status(200).json({
                message: "Autenticación exitosa",
                data:others
            })
            return;
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "Algo salió mal",
                data: null
            });
            return;
        }
}
const generateToken = () => {
    const min = 100000;
    const max = 999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function forgotPassword(req:Request, res:Response) {
    const {email} = req.body
    try {
        //Chequear que el usuario exista con este email
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });
        if(!existingUser){
            res.status(404).json({
                error: "No existe un usuario con este email",
                data: null
            });
            return;
        }
        const resetToken = generateToken().toString();
        const resetTokenExpiry = addMinutes(new Date(), 10);
        const currentTime = new Date();

        //Actualizar al usuario con el token y la fecha de expiración

        const newupdatedUser = await db.user.update({
            where: { email },
            data: {
                resetToken: resetToken,
                resetTokenExpiry,
            }
        });

        //Enviar correo con el token
       /* const hbsOptions = {
            viewEngine: {
                defaultLayout: false
            },
            viewPath: '../views'
        }*/
       /* transporter.use('compile', hbs({
            viewEngine: {
            defaultLayout: false
        },
        viewPath: '../views'
    }));*/
    const mail = {
        from: "alex@energonet.une.cu",
        to: newupdatedUser.email,
        subject: "Recuperar contraseña",
        html: generateResetPasswordEmail(resetToken)
    }
    const info = await transporter.sendMail(mail)
    if(info.accepted){
        res.status(200).json({
            message: `Correo de verificación enviado a ${email}`,
            data: {userId: newupdatedUser.iduser}
        });
        return;}
        if(info.rejected){
            res.status(400).json({
                message: `El mensaje fue rechazado`,
                data: null
            });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Algo salió mal",
            data: null
        });
        return;
    }
}

export async function verifyToken(req:Request, res:Response){
    const {token} = req.params;
    try {
        const user = await db.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: { gte: new Date()}
            }
        });
        if (!user){
            res.status(403).json({
                message: "Token inválido o expirado"
            });
            return;
        }

        res.status(200).json({
            message: "El token es válido"
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:"Algo salió mal"
        })
    }
}

export async function changePassword(req:Request, res:Response){
    const token = req.cookies.accessToken; 
    const { newPassword } = req.body;

    try {
        const user = await db.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpiry: {
                    gte: new Date()
                }
            }
        });
        if(!user){
            res.status(400).json({ message: "Token inválido o expirado"});
            return;
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.user.update({
            where: {iduser: user?.iduser},
            data:{
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null
            }
        });
        res.status(200).json({
            message: "Contraseña restablecida exitosamente"
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Algo salió mal"
        });
        return;
    }
}

export async function refreshToken(req:Request, res:Response) {
    try {
        const userId = (req as any).user?.iduser
        const refreshToken = req.cookies.refreshToken;

        const user = await db.user.findUnique({
            where: {
                iduser: userId
            }
        });
        if(!user || !user.refreshToken){
            res.status(403).json({
                error: "Token inválido",
                message: null
            });
            return; 
        }
        const newAccessToken = generateAccessToken({iduser: userId})
        res.cookie("access-token", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 15 * 60 * 1000, //15 minutos
            sameSite: "strict"
        })
        res.status(200).json({
            error: null,
            message: "Actualizado el token con éxito"
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: null,
            error: "Algo salió mal"
        });
    }
}

export async function logoutUser(req:Request, res:Response) {
    try {
        //Asegurarse que el usuario este autenticado antes de ejecutar el metodo
        //la autenticacion se hace en el middleware que chequeara la presencia de un accestoken valido
        //Quitar el refreshToken del Usuario de la bd

        const userId = (req as any).user?.iduser

        if(userId){
            await db.user.update({
                where: {
                    iduser: userId
                },
                data: {
                    refreshToken: null
                }
            });
        }

        res.clearCookie("access-token");
        res.clearCookie("refresh-token");
        res.status(200).json({
            error: null,
            message: "El usuario ha cerrado sesión"
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            message: null
        });
        return;
    }
}

