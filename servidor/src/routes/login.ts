import { authenticateUser, forgotPassword } from "../controllers/login"
import express from "express"

const loginRouter = express.Router()

loginRouter.post("/auth/login", authenticateUser);
loginRouter.put("/auth/forgot-password", forgotPassword)

export default loginRouter