import {db} from "../db/db"
import { Request, Response } from "express"

export async function createMotherboard(req:Request, res:Response) {
    const { id_computer, manufacturer, model, serial_number} = req.body
try {
    const computer = await db.computer.findUnique({
        where: {
            id_computer: id_computer
        }
    });
    if(!computer){
        res.status(404).json({
            error: "La computadora no existe",
            data: null
        });
        return;
    }
   /* if(serial_number != ""){
    const motherboard = await db.motherboard.findFirst({
        where: {
            serial_number: serial_number
        }
    });
    if(!motherboard)
}*/
    const motherboard = await db.motherboard.findUnique({
        where: {
            serial_number: serial_number
        }
    });
    if(motherboard){
        res.status(403).json({
            error: `Ya existe una motherboard con número de serie ${serial_number}`,
            data: null
        });
        return;
    }
    const newMotherboard = await db.motherboard.create({
        data: {
            id_computer,
            manufacturer,
            model,
            serial_number
        }
    });
    res.status(200).json({
        error: null,
        data: newMotherboard
    });
    return;
} catch(error){
    console.log(error);
    res.status(500).json({
        error: "Algo salió mal",
        data: null
    });
    return;
}
}

export async function getMotherboards(req:Request, res:Response){
    try {
        const allMothers = await db.motherboard.findMany({
            orderBy: {
                manufacturer: "desc"
            },
            include:{
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            error: null,
            data: allMothers
        });
        return;
    } 
    catch(error) {
        console.log(error);
        res.status(500).json({
            error:"Algo salió mal",
            data: null
        });
        return;
    }
}

export async function getMotherboardById(req:Request,res:Response) {
     const { id } = req.params;
     try {
        const motherboard = await db.motherboard.findUnique({
            where: {
                id_motherboard: id
            },
            include: {
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if(!motherboard){
            res.status(404).json({
                error: "No se encuentra la motherboard",
                data:null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: motherboard
        });
        return;
     } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        });
     }   
}

export async function updateMotherboard(req:Request, res:Response){
    const {id} = req.params
    const { id_computer, manufacturer, model, serial_number} = req.body
    try {
        
    } catch (error) {
        
    }
}