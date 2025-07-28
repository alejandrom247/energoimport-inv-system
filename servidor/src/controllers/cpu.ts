import { db } from "../db/db";
import { Request, Response } from "express";

export async function createCPU(req:Request, res:Response){
    const { id_computer, name, manufacturer, model, capacity } = req.body

    try {
        const computer = await db.computer.findUnique({
            where: {
                id_computer
            }
        });
        if(!computer){
            res.status(404).json({
                error: "No existe la computadora"
            });
            return;
        }
        const cpuByIdComputer = await db.cPU.findUnique({
            where: {
                id_computer
            },
            include: {
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if(cpuByIdComputer){
            res.status(403).json({
                error: `La computadora ${cpuByIdComputer.computer.name} ya tiene un CPU asignado`
            });
            return;
        }
        const newCPU = await db.cPU.create({
            data: {
                id_computer,
                name,
                manufacturer,
                model,
                capacity
            }
        });
        res.status(200).json({
            error: null,
            data: newCPU
        });
        return;
    }
    catch (error){
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        });
        return;
    }

}

export async function getCPUs(res:Response) {
    try {
        const allCPUs = await db.cPU.findMany({
            orderBy: {
                name: "asc"
            },
            include: {
                computer: {
                    select: {
                        name: true
                    }
                }
            }
            });
            res.status(200).json({
                error: null,
                data: allCPUs
            });
            return;
    } catch (error) {
        console.log(error)
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        });
        return;
    }
}

export async function getCPUById(req:Request, res:Response) {
    const {id} = req.params

    try {
        const CPU = await db.cPU.findUnique({
            where: {
                id_cpu: id
            },
            include:{
                computer: {
                    select: {
                        name: true
                    }
                }
            }
        });
        if(!CPU){
            res.status(404).json({
                error: "El CPU no existe",
                data: null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: CPU
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

export async function getCPUByComputer(req:Request, res:Response) {
    const {id_computer} = req.params

    try {
        const CPU = await db.cPU.findFirst({
            where: {
                id_computer
            }
        });
        if(!CPU) {
            res.status(404).json({
                error: "No se encuentra el CPU"
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: CPU
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

export async function updateCPU(req:Request, res:Response) {
   const {id} = req.params

   const {id_computer, name, manufacturer, model, capacity } = req.body
   
   try {
    const cpu = await db.cPU.findUnique({
        where: {
            id_cpu: id
        }
    });
    if(!cpu){
        res.status(404).json({
            error: "No se encuentra el CPU",
            data: null
        });
        return;
    }
    if(cpu.id_computer != id_computer){
        const cPUByidComputer = await db.cPU.findFirst({
            where: {
                id_computer: id_computer
            }
        });
        if(cPUByidComputer){
            res.status(403).json({
                error: "El CPU ya está asignado a otra PC",
                data: null
            })
            return;
        }
    }
    const updatedCPU = await db.cPU.update({
        where: {
            id_cpu: id
        },
        data: {
            id_computer,
            name,
            manufacturer,
            model,
            capacity
        }
    });
    res.status(200).json({
        error: null,
        data: updatedCPU
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

export async function deleteCPU(req:Request, res:Response) {
    const {id} = req.params;

    try {
        const cpu = db.cPU.findUnique({
            where: {
                id_cpu: id
            }
        });
        if(!cpu){
            res.status(404).json({
                error: "No se encuentra el CPU",
                success: false
            });
            return;
        }
        db.cPU.delete({
            where: {
                id_cpu: id
            }
        });
        res.status(200).json({
            error: null,
            success: true
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            success: false
        });
        return;
    }
}