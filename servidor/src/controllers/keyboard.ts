import {db} from "../db/db"
import { Request, Response } from "express"

export async function createKeyboard(req:Request, res:Response) {
    const { id_computer, manufacturer, model, serial_number } = req.body
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
    const keyboard = await db.keyboard.findUnique({
        where: {
            serial_number: serial_number
        }
    });
    if(keyboard){
        res.status(403).json({
            error: `Ya existe un teclado con número de serie ${serial_number}`,
            data: null
        });
        return;
    }
    const newKeyboard = await db.keyboard.create({
        data: {
            id_computer,
            manufacturer,
            model,
            serial_number,
        }
    });
    res.status(200).json({
        error: null,
        data: newKeyboard
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

export async function getKeyboard(req:Request, res:Response){
    try {
        const allKeyboard = await db.keyboard.findMany({
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
            data: allKeyboard
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

export async function getKeyboardById(req:Request,res:Response) {
     const { id } = req.params;
     try {
        const keyboard = await db.keyboard.findUnique({
            where: {
                id_keyboard: id
            },
            include: {
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if(!keyboard){
            res.status(404).json({
                error: "No se encuentra el teclado",
                data:null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: keyboard
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

export async function updateKeyboard(req:Request, res:Response){
    const {id} = req.params
    const { id_computer, manufacturer, model, serial_number } = req.body
    try {
        const keyboard = await db.keyboard.findUnique({
            where: {
                id_keyboard: id
            }
        });
        if(!keyboard){
            res.status(404).json({
                error: "El teclado no existe",
                data: null
            });
            return;}
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

        if(keyboard.serial_number != serial_number){
            const keyboardBySerialNumber = await db.keyboard.findUnique({
                where: {
                    serial_number: serial_number
                }
            });
            if(keyboardBySerialNumber){
                res.status(403).json({
                    error: `Ya existe un teclado con el número de serie: ${serial_number}`,
                    data: null
                });
            }
            return;      
        }
        const updatedKeyboard = await db.keyboard.update({
            where: {
                id_keyboard: keyboard.id_keyboard
            },
            data: {
                id_computer,
                manufacturer,
                model,
                serial_number,
            }
        });
        res.status(200).json({
            error: null,
            data: updatedKeyboard
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
    }
}

export async function deleteMonitor(req:Request,res:Response) {
    const {id} = req.params

    try {
        const keyBoard = await db.keyboard.findUnique({
            where: {
                id_keyboard: id
            }
        });
        if (!keyBoard) {
            res.status(404).json({
                error: "No existe el teclado",
                data: null
            });
            return;
        }
        db.keyboard.delete({
            where: {
                id_keyboard: id
            }
        });
        res.status(200).json({
            error: null,
            success: true
        });
        return;
    } catch (error) {
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        });
        return;
    }
}