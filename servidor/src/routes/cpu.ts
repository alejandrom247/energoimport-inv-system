import express from "express";
import {createCPU, getCPUs, getCPUById, getCPUByComputer, updateCPU, deleteCPU} from "../controllers/cpu"

const cpuRouter = express.Router();

cpuRouter.post("/cpu", createCPU);
cpuRouter.get("/cpus", getCPUs);
cpuRouter.get("/cpu/:id", getCPUById);
cpuRouter.get("/cpu/computadora/:id", getCPUByComputer);
cpuRouter.put("/cpu/:id", updateCPU);
cpuRouter.delete("/cpu/:id", deleteCPU);

export default cpuRouter;