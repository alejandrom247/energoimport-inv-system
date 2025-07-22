import { createMotherboard, deleteMotherboard, getMotherboardById, getMotherboards, updateMotherboard } from "../controllers/motherboard";
import express from "express"

const motherboardRouter = express.Router();

motherboardRouter.post("/motherboard/", createMotherboard);
motherboardRouter.get("/motherboards", getMotherboards);
motherboardRouter.get("/motherboard/:id", getMotherboardById);
motherboardRouter.put("/motherboard/:id", updateMotherboard);
motherboardRouter.delete("/motherboard/:id", deleteMotherboard)

export default motherboardRouter