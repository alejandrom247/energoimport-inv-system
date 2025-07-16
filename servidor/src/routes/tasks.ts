import { createTask, deleteTasksById, getTasks, getTasksById, getTasksByUser, updateTaskById } from "../controllers/tasks";
import express from "express";

const tasksRouter = express.Router()

tasksRouter.post("/tarea/", createTask)
tasksRouter.put("/tarea/:id", updateTaskById);
tasksRouter.get("/tarea/", getTasks);
tasksRouter.get("/tarea/usuario/:iduser", getTasksByUser)
tasksRouter.get("/tarea/:id", getTasksById)
tasksRouter.delete("/tarea/:id", deleteTasksById)


export default tasksRouter;