import { createMonitor, deleteMonitor, getMonitorById, getMonitor, updateMonitor } from "../controllers/monitor";
import express from "express"

const monitorRouter = express.Router();

monitorRouter.post("/monitor/", createMonitor);
monitorRouter.get("/monitors/", getMonitor);
monitorRouter.get("/monitor/:id", getMonitorById);
monitorRouter.put("/monitor/:id", updateMonitor);
monitorRouter.delete("/monitor/:id", deleteMonitor)

export default monitorRouter