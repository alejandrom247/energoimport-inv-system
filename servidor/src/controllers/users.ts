import { Request, Response } from "express";

export async function obtenerUsuario(req:Request,res:Response) {
     const usuarios = [
        { 
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1234567890"
        },
        {
            name: "Joel Smith",
            email: "joel.smith@example.com",
            phone: "+0987654321"
        },
        {
            name: "Muke John",
            email: "john.muke@example.com",
            phone: "+0987654321"
        },
    ];
    res.status(200).json(usuarios)
}