import { verifyToken } from "../middleware/authMiddleware";
import { createTask, deleteTasksById, getTasks, getTasksById, getTasksByUser, updateTaskById } from "../controllers/tasks";
import express from "express";

const tasksRouter = express.Router()

tasksRouter.post("/tarea/",verifyToken, createTask)
tasksRouter.put("/tarea/:id",verifyToken, updateTaskById);
tasksRouter.get("/tarea/",verifyToken, getTasks);
tasksRouter.get("/tarea/usuario/:iduser",verifyToken, getTasksByUser)
tasksRouter.get("/tarea/:id",verifyToken, getTasksById)
tasksRouter.delete("/tarea/:idtask",verifyToken, deleteTasksById)


export default tasksRouter;