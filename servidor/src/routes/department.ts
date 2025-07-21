import { createDepartment, createMultipleDepartment, deleteDepartment, deleteMultipleDepartment, getDeparments, getDepartmentById, updateDepartment } from "../controllers/department";
import express from "express"

const departmentRouter = express.Router();

departmentRouter.post("/departamento/", createDepartment);
departmentRouter.post("/departamentos", createMultipleDepartment);
departmentRouter.get("/departamentos/", getDeparments);
departmentRouter.get("/departamento/:id", getDepartmentById);
departmentRouter.put("/departamento/:id", updateDepartment);
departmentRouter.delete("/departamento/:id", deleteDepartment);
departmentRouter.delete("/departamentos", deleteMultipleDepartment)

export default departmentRouter;