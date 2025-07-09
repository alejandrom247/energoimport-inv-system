import { db } from "../db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function createUser(req:Request,res:Response) {
    
    const { 
        name, 
        lastname, 
        email, 
        avatar_url,
        username,
        password,
        role } = req.body;   
   try {
    const existingUserByEmail = await db.user.findUnique({
        where: {
            email
        }
    });
    if (existingUserByEmail) {
        res.status(409).json({
            error: `El email (${email}) ya ha sido usado`,
            data: null
        })

    }
    const existingUserByUsername = await db.user.findUnique({
        where: {
            username
        }
    })
    if (existingUserByUsername) {
        res.status(409).json({
            error: `El nombre de usuario (${username}) ya ha sido usado`,
            data: null
        })
    }
        const hashedPassword:string = await bcrypt.hash(password, 10);
        //Creando usuario
        const newUser = await db.user.create({
            data: 
            {
                name, 
                lastname, 
                email, 
                avatar_url: avatar_url ? avatar_url : "",
                username, 
                password: hashedPassword,
                role: role ? role : "SUPERVISOR"
            },
        });
        const { password:savedPassword, ...others} = newUser
        
    res.status(201).json({
        error: null,
        data: others
    });
   
   
   } catch (error) {
    console.log(error);
    res.status(500).json({
        error: "Algo salio mal",
        data: null
    })
   }
}

export async function getUsers(req:Request, res:Response){
    try {
        const users = await db.user.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });
        const filteredUsers = users.map((user) => {
            const {password, ...others} = user
            return others;
        })
        res.status(200).json({
            data:filteredUsers,
            error:null
        })
    } catch (error) {
    console.log(error);
    res.status(500).json({
        error: "Algo salio mal",
        data: null
    })
    }
}

export async function getUsersById(req:Request, res:Response) {
    const { id } = req.params
    try {
        const user = await db.user.findUnique({
            where: {
                iduser: id
            }
        });
        if(!user) {
            return res.status(404).json({
                error:"No se encuentra al usuario",
                data:null
            })
        }
        const {password, ...others} = user

        res.status(200).json({
            error: null,
            data: others
        })
    } catch (error) {
    console.log(error);
    res.status(500).json({
        error: "Algo salio mal",
        data: null
    })
    }
}