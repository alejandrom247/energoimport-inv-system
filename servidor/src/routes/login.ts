import { authenticateUser, changePassword, forgotPassword, verifyToken } from "../controllers/login"
import express from "express"

const loginRouter = express.Router()

loginRouter.post("/auth/login", authenticateUser);
loginRouter.put("/auth/forgot-password", forgotPassword)
loginRouter.get("/auth/verify-token", verifyToken);
loginRouter.put("/auth/change-password", changePassword)

export default loginRouter