import { db } from "../db/db"
import { Request, Response } from "express"

export async function createTask(req:Request, res:Response) {
    const {   
        description,
        start_date,
        end_date, 
        id_user } = req.body
        const actualDate = new Date().toISOString();
        let form_start_date = "";
        if(start_date){
        form_start_date = new Date(start_date).toISOString();
        }
        else {
           form_start_date = actualDate
        }
        const form_end_date = new Date(end_date).toISOString()
    try {
      /*  if (!form_start_date && form_end_date < actualDate){
            res.status(403).json({
                error:"La fecha de inicio no puede ser mayor a la de fin",
                data:null
            })
            return;
        }*/
        if (form_start_date && form_start_date > form_end_date) {
        res.status(403).json({
            error: "La fecha de inicio no puede ser mayor que la de fin"
        });
        return;
    }
        const newTask = await db.task.create({
            data: {
                description,
                start_date: form_start_date ? form_start_date : actualDate,
                end_date: form_end_date,
                id_user
            }
        });
        res.status(200).json({
            error: null,
            data: newTask
        })
        return;
    } catch(error) {
        console.log(error);
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
        return;
    }
}

export async function updateTaskById(req:Request,res:Response) {
    const {
        description,
        start_date,
        end_date,
        id_user 
    } = req.body
    const { id } = req.params
    try {
    if (start_date > end_date) {
        res.status(403).json({
            error: "La fecha de inicio no puede ser mayo que la de fin"
        });
        return;
    }
    const updatedTask = await db.task.update({
        data: {
            description,
            start_date,
            end_date,
            id_user
        },
        where: {
            id_task: id
        }
    });
    res.status(200).json({
        error: null,
        data: updatedTask
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
export async function getTasks(req:Request,res:Response) {
    try {
        const allTasks = await db.task.findMany({
            orderBy: {
                start_date: "desc"
            }
        });
        res.status(200).json({
            error: null,
            data: allTasks
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

export async function getTasksById(req:Request,res:Response) {
    const { id } = req.params
    try {
        const task = await db.task.findUnique({
            where: {
                id_task:id
            }
        });
        if (!task) {
            res.status(404).json({
                error: "No se encuentra la tarea",
                data:null
            });
            return;
        }
        const { id_task, ...others} = task
        res.status(200).json({
            error: null,
            data: others
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

export async function getTasksByUser(req:Request,res:Response) {
    const { iduser } = req.params
    try {
        const user = await db.user.findUnique({
            where: {
                iduser: iduser
            }
        });
        if(!user){
            res.status(404).json({
                error: "No se encuentra al usuario",
                data: null
            });
            return;
        }
        const tasks = await db.task.findMany({
            where: {
                id_user: iduser
            },
            orderBy: {
                start_date: "desc"
            }
        });
        res.status(200).json({
            error: null,
            data: tasks
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

export async function deleteTasksById(req:Request,res:Response) {
    const { idtask }= req.params
    try {
        const task = await db.task.findUnique({
            where: {
                id_task:idtask
            }
        });
        if (!task){
            res.status(404).json({
                error: "No se encuentra la tarea",
                success: false
            });
            return;
        }
        await db.task.delete({
            where: {
                id_task: idtask
            }
        })
        res.status(200).json({
            error: null,
            success: true
        });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error:"Algo salió mal",
            success: false
        });
        return;
    }
}