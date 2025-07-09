//import { getUserById, getUsers } from "../controllers/users";
import express from "express"

const userRouter = express.Router();

userRouter.get("/usuario")
userRouter.get("/usuario/:iduser")


export default userRouter
