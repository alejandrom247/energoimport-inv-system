import {db} from "../db/db"
import {Request, Response} from "express"

export async function createMultipleDepartment(req:Request, res:Response) {
    const departmentsToBeCreated:[{name: string, active:boolean}] = req.body
try {
    const departments = await db.department.findMany({
        where:{
            name: {
                in: departmentsToBeCreated.map(d => d.name)
            }
        }
    });
    if(departments.length != 0) {
        res.status(403).json({
            error: `Al menos uno de los departamentos ya existe`,
            data: null
        });
        return;
    }
    const newDepartments = await db.department.createMany({
        data: departmentsToBeCreated
    });
    res.status(200).json({
        error: null,
        data: newDepartments
    })
    return;
} catch(error){
    console.log(error)
    res.status(500).json({
        error: "Algo salió mal",
        data:null
    });
    return;
}
}

export async function createDepartment(req:Request, res:Response) {
    const {name, active} = req.body
try {
    const department = await db.department.findUnique({
        where:{
            name: name
        }
    });
    if(department) {
        res.status(403).json({
            error: `El dapartamento ${name} ya existe`,
            data: null
        });
        return;
    }
    const newDepartment = await db.department.create({
        data: {
            name,
            active
        }
    });
    res.status(200).json({
        error: null,
        data: newDepartment
    })
    return;
} catch(error){
    console.log(error)
    res.status(500).json({
        error: "Algo salió mal",
        data:null
    });
    return;
}
}
export async function getDeparments(req:Request,res:Response) {
    try {
        const departments = await db.department.findMany({
            orderBy: {
                name: "asc"
            }
        });
        res.status(200).json({
            error: null,
            data: departments
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

export async function getDepartmentById(req:Request,res:Response){
    const { id } = req.params;
    try {
        const department = await db.department.findUnique({
            where:{
                id_department: id
            }
        });
        if(!department){
            res.status(404).json({
                error: "No se encontró el departamento",
                data: null
            });
            return;
        }
        res.status(200).json({
            error: null,
            data: department
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

export async function updateDepartment(req:Request, res:Response) {
    const { id } = req.params;
    const { name, active } = req.body
    try {
    const department = await db.department.findUnique({
        where: {
            id_department: id
        }
    });
    if(!department) {
        res.status(404).json({
            error: "No se encuentra el departamento",
            data:null
        });
        return;
    }
    const updatedDepartment = await db.department.update({
        data: {
            name,
            active
        },
        where: {
            id_department: id
        }
    });
    res.status(200).json({
        error: null,
        data: updatedDepartment
    });
    return;
} catch (error){
console.log(error),
res.status(500).json({
    error: "Algo salió mal",
    data:null
});
return;
}
}

export async function deleteDepartment(req:Request, res:Response){
    const { id } = req.params
    try {
        const department = await db.department.findUnique({
            where: {
                id_department: id
            }
        });
        if(!department){
            res.status(404).json({
                error: "No se encuentra el departamento",
                success: false
            });
            return;
        }
        await db.department.delete({
            where: {
                id_department:id
            }
        });
        res.status(200).json({
            error: null,
            success: true
        })
        return;
    } catch (error) {
        console.log(error),
        res.status(500).json({
            error: "Algo salió mal",
            success: false
        })
        return;
    }
}


export async function deleteMultipleDepartment(req:Request, res:Response){
    const departmentstoBeDeleted: [{ id:string }] = req.body
    try {
         
        const departments = await db.department.findMany({
            where: {
                id_department: {
                    in: departmentstoBeDeleted.map(d => d.id)
                }
            }
    })
        console.log(departments)
        if(departments.length != departmentstoBeDeleted.length){
            res.status(404).json({
                error: "No se encuentra al menos uno de los departamentos",
                success: false
            });
            return;
        }
        await db.department.deleteMany({
            where: {
                id_department: {
                in: departmentstoBeDeleted.map(d => d.id)
            }
            }
    });
        res.status(200).json({
            error: null,
            success: true
        })
        return;
    } catch (error) {
        console.log(error),
        res.status(500).json({
            error: "Algo salió mal",
            success: false
        })
        return;
    }
}