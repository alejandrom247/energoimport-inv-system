import AuthMiddleware from "../middleware/authMiddleware";
import { authenticateUser, changePassword, forgotPassword, getMe, logoutUser, refreshToken, /*verifyToken*/ } from "../controllers/login"
import express from "express"

const loginRouter = express.Router()

loginRouter.post("/auth/login", authenticateUser);
loginRouter.put("/auth/forgot-password",  forgotPassword)
//loginRouter.get("/auth/verify-token", verifyToken);
loginRouter.put("/auth/change-password", AuthMiddleware.resetTokenValidation, changePassword)
loginRouter.post("/auth/refresh-token", AuthMiddleware.refreshTokenValidation, refreshToken);
loginRouter.get("/auth/getme", AuthMiddleware.authenticateUser, getMe)
loginRouter.put("/auth/logout", AuthMiddleware.authenticateUser, logoutUser);

export default loginRouter