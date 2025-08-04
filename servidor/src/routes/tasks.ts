import { createTask, deleteTasksById, getTasks, getTasksById, getTasksByUser, updateTaskById } from "../controllers/tasks";
import express from "express";
import AuthMiddleware from "../middleware/authMiddleware";

const tasksRouter = express.Router()

tasksRouter.post("/tarea/", AuthMiddleware.authenticateUser, createTask)
tasksRouter.put("/tarea/:id", AuthMiddleware.authenticateUser, updateTaskById);
tasksRouter.get("/tarea/", AuthMiddleware.authenticateUser, getTasks);
tasksRouter.get("/tarea/usuario/:iduser", AuthMiddleware.authenticateUser, getTasksByUser)
tasksRouter.get("/tarea/:id", AuthMiddleware.authenticateUser, getTasksById)
tasksRouter.delete("/tarea/:idtask", AuthMiddleware.authenticateUser, deleteTasksById)


export default tasksRouter;