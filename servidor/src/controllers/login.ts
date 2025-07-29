import {db} from "../db/db"
import {Request, Response} from "express";
import bcrypt from "bcrypt"
import { generateAccessToken } from "../util/generateJWT";
import { addMinutes } from "date-fns";
import { transporter } from "../util/nodemailer";
import generateResetPasswordEmail from "../util/generateEmailTemplate"
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
            const accessToken = generateAccessToken(others)
            const result = {
                ...others,
                accessToken
            }
            res.status(200).json({
                error:null,
                data:result
            });
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
    const { token } = req.params; 
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