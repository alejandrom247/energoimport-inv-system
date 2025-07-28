import { createKeyboard, deleteKeyboard, getKeyboardById, getKeyboards, updateKeyboard } from "../controllers/keyboard";
import express from "express"

const keyboardRouter = express.Router();

keyboardRouter.post("/teclado", createKeyboard);
keyboardRouter.get("/teclados", getKeyboards);
keyboardRouter.get("/teclado/:id", getKeyboardById);
keyboardRouter.put("/teclado/:id", updateKeyboard);
keyboardRouter.delete("/teclado/:id", deleteKeyboard);

export default keyboardRouter;