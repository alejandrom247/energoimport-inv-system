//import { getUserById, getUsers } from "../controllers/users";
import express from "express"
import { createUser, getUsers } from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/usuario", getUsers)
userRouter.post("/usuario", createUser)

export default userRouter
