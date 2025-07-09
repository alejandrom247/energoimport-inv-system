import { db } from "../db/db";
import { Request, Response } from "express";

export async function createUser(req:Request,res:Response) {
    const { 
        name, 
        lastname, 
        email, 
        avatar_url,
        username, 
        password } = req.body;   
   try {
    const existingUserByEmail = await db.user.findUnique({
        where: {
            email
        }
    })
    if (existingUserByEmail) {
        res.status(409).json({
            error: 'El email ya ha sido usado',
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
            error: 'El nombre de usuario ya ha sido usado',
            data: null
        })

    }
   } catch (error) {
    
   }
}