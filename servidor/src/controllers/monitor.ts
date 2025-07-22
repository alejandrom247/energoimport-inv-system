import { error } from "console";
import {db} from "../db/db"
import { Request, Response } from "express"

export async function createMonitor(req:Request, res:Response) {
    const { id_computer, manufacturer, model, serial_number, no_inv, state } = req.body
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
    const monitor = await db.monitor.findUnique({
        where: {
            no_inv: no_inv
        }
    });
    if(monitor){
        res.status(403).json({
            error: `Ya existe un monitor con número de inventario ${no_inv}`,
            data: null
        });
        return;
    }
    const newMonitor = await db.monitor.create({
        data: {
            id_computer,
            manufacturer,
            model,
            serial_number,
            no_inv,
            state
        }
    });
    res.status(200).json({
        error: null,
        data: newMonitor
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

export async function getMonitor(req:Request, res:Response){
    try {
        const allMonitor = await db.monitor.findMany({
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
            data: allMonitor
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

export async function getMonitorById(req:Request,res:Response) {
     const { id } = req.params;
     try {
        const monitor = await db.monitor.findUnique({
            where: {
                id_monitor: id
            },
            include: {
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if(!monitor){
            res.status(404).json({
                error: "No se encuentra la motherboard",
                data:null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: monitor
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

export async function updateMonitor(req:Request, res:Response){
    const {id} = req.params
    const { id_computer, manufacturer, model, serial_number, no_inv, state } = req.body
    try {
        const monitor = await db.monitor.findUnique({
            where: {
                id_monitor: id
            }
        });
        if(!monitor){
            res.status(404).json({
                error: "La motherboard no existe",
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
        if(monitor.no_inv != no_inv){
            const monitorByNoInv = await db.monitor.findUnique({
                where: {
                    no_inv: no_inv
                }
            });
            if(monitorByNoInv){
                res.status(403).json({
                    error: `Ya existe un monitor con el número de inventario: ${no_inv}`,
                    data: null
                });
            }
            return;
        }
        if(monitor.serial_number != serial_number){
            const monitorBySerialNumber = await db.monitor.findUnique({
                where: {
                    serial_number: serial_number
                }
            });
            if(monitorBySerialNumber){
                res.status(403).json({
                    error: `Ya existe un monitor con el número de serie: ${serial_number}`,
                    data: null
                })
            }        
        }
        const updatedMotherboard = await db.monitor.update({
            where: {
                id_monitor: monitor.id_monitor
            },
            data: {
                id_computer,
                manufacturer,
                model,
                serial_number,
                no_inv,
                state
            }
        });
        res.status(200).json({
            error: null,
            data: updatedMotherboard
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
        const monitor = await db.monitor.findUnique({
            where: {
                id_monitor: id
            }
        });
        if (!monitor) {
            res.status(404).json({
                error: "No existe el monitor",
                data: null
            });
        }
        db.monitor.delete({
            where: {
                id_monitor: id
            }
        });
        res.status(200).json({
            error: null,
            success: true
        })
    } catch (error) {
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
    }
}