import { db } from "../db/db"
import { Request, Response } from "express"

export async function createTask(req:Request, res:Response) {
    const {   
        description,
        start_date,
        end_date, 
        id_user } = req.body
        const actualDate = new Date().getDate()
    try {
        if (!start_date && end_date < actualDate){
            return res.status(403).json({
                error:"La fecha de inicio no puede ser mayor a la de fin",
                data:null
            })
        }
        if (start_date && start_date > end_date) {
        return res.status(403).json({
            error: "La fecha de inicio no puede ser mayo que la de fin"
        });
    }
        const newTask = await db.task.create({
            data: {
                description,
                start_date: start_date ? start_date : actualDate,
                end_date,
                id_user
            }
        });
        return res.status(200).json({
            error: null,
            data: newTask
        })
    } catch(error) {
        res.status(500).json({
            error: "Algo salió mal",
            data: null
        })
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
        return res.status(403).json({
            error: "La fecha de inicio no puede ser mayo que la de fin"
        });
    }
} catch (error) {

}
}