import {db} from "../db/db"
import {Request, Response} from "express"
import { computerInclude } from "../util/types";

export async function createComputer(req:Request,res:Response) {
    const { id_department, name, username, os, no_inv, total_rmemory, total_dmemory, state, id_user } = req.body
    try {
    const computerByName = await db.computer.findUnique({
        where: {
            name: name
        }
    });
    if(computerByName){
        res.status(403).json({
            error: `La computadora ${name} ya existe`,
            data: null
        });
        return;
    }
    const computerByInv = await db.computer.findUnique({
        where: {
            no_inv: no_inv
        }
    });
    if(computerByInv){
            res.status(403).json({
            error: `La computadora con número de inventario ${no_inv} ya existe`,
            data: null
        });
        return;
    }
    const departmentById = await db.department.findUnique({
        where: {
            id_department:id_department
        }
    });
    if(!departmentById){
            res.status(404).json({
            error: `El departamento no existe`,
            data: null
        });
        return;
    }
    const newComputer = await db.computer.create({
        data: {
            id_department,
            id_user,
            name,
            username,
            os,
            no_inv,
            total_rmemory,
            total_dmemory,
            state: state ? state : "BUENO"
        }
    });
    res.status(200).json({
        error: null,
        data: newComputer
    })
    return;
} catch(error) {
    console.error(error)
    res.status(500).json({
        error: "Algo salió mal",
        data: null
    });
    return;
}
}

export async function getComputers(req:Request,res:Response){
    try {
        const allComputers = await db.computer.findMany({
            orderBy: {
                name: "desc"
            },
            include: computerInclude
        });
        res.status(200).json({
            error: null,
            data: allComputers
        });
        return;
    } catch(error) {
        console.log(error)
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
        return;
    }
}

export async function getComputersByDepartment(req:Request,res:Response) {
    const {id_department} = req.params;
    try {
    const department = await db.department.findUnique({
        where: {
            id_department: id_department
        }
    });
    if(!department){
        res.status(404).json({
            error: "El departamento no existe en la BD",
            data: null
        });
        return;
    }
    
        const computers = await db.computer.findMany({
            where: {
                id_department: id_department
            },
            include: {
                department: {
                    select: {
                        name: true
                    }
                }
            }
        });
        res.status(200).json({
            error: null,
            data: computers
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

export async function getComputerById(req:Request, res:Response) {
    const { id } = req.params

    try {
        const computer = await db.computer.findUnique({
            where: {
                id_computer: id
            },
            include: computerInclude
        });
        if(!computer){
            res.status(404).json({
                error: "No existe la computadora",
                data: null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: computer
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

export async function updateComputerById(req:Request, res:Response) {
    const {id} = req.params;
    const { id_department, name, username, os, no_inv, total_rmemory, total_dmemory, state, id_user } = req.body;

    try {
        const computer = await db.computer.findUnique({
            where: {
                id_computer: id,}
        });
        if(!computer) {
            res.status(404).json({
                error: "No existe la computadora",
                data: null
            });
            return;
        }
        if(computer?.name != name){
            const computerByName = await db.computer.findUnique({
                where: {
                    name: name
                }
            });
            if(computerByName){
                res.status(403).json({
                    error: `Ya existe una computadora llamada ${name}`
                });
                return;
            };
        }
        if(computer?.no_inv != no_inv){
                const computerByInv = await db.computer.findUnique({
                    where: {
                        no_inv: no_inv
                    }
                });
                if(computerByInv){
                    res.status(403).json({
                        error: `Ya existe una computadora con no_inv`,
                        data: null
                    });
                    return;
                }
            }
        const department = await db.department.findUnique({
            where: {
                id_department: id_department
            }
        });
        if(!department){
            res.status(404).json({
                error: "El departamento no existe",
                data: null
            });
            return;
        }
        const user = await db.user.findUnique({
            where: {
                iduser: id_user
            }
        });
        if(!user){
            res.status(404).json({
                error: "No existe el usuario",
                data: null
            });
        }
        const updatedComputer = await db.computer.update({
            where: {
                id_computer: id
            },
                data: {
                    id_department,
                    name,
                    username,
                    os,
                    no_inv,
                    total_rmemory,
                    total_dmemory,
                    state,
                    id_user
                },
                include: {
                    department: {
                        select: {
                            name: true
                        }
                    },
                    createdBy: {
                        select: {
                            username: true
                        }
                    }
                    
                }
            });
            res.status(200).json({
                error: null,
                data: updatedComputer
            });
            return;
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
    }

}

export async function deleteComputer(req:Request,res:Response) {
    const {id} = req.params

    try {
        const computer = await db.computer.findUnique({
            where: {
                id_computer: id
            }
        });
        if(!computer){
            res.status(404).json({
                error: "No existe la computadora",
                success: false
            });
            return;
        }
        await db.computer.delete({
            where: {
                id_computer: computer.id_computer
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
            data: null
        })
        return;
    }
}