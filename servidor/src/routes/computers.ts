import { createComputer, deleteComputer, getComputerById, getComputers, getComputersByDepartment, updateComputerById } from "../controllers/computers";
import express from "express"

const computerRouter = express.Router();

computerRouter.post("/computadora", createComputer);
computerRouter.get("/computadoras", getComputers);
computerRouter.get("/computadoras/departamento/:id_department", getComputersByDepartment);
computerRouter.get("/computadora/:id", getComputerById);
computerRouter.put("/computadora/:id", updateComputerById)
computerRouter.delete("/computadora/:id", deleteComputer);


export default computerRouter;