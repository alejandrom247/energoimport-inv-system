//import { getUserById, getUsers } from "../controllers/users";
import express from "express"
import { createUser, getUsers, getUserById, updateUserById, updateUserPasswordById, deleteUsersById } from "../controllers/users";

const userRouter = express.Router();

userRouter.post("/usuario", createUser)
userRouter.get("/usuario", getUsers)
userRouter.get("/usuario/:id", getUserById)
userRouter.put("/usuario/:id", updateUserById)
userRouter.put("/usuario/actualizar-password/:id", updateUserPasswordById)
userRouter.delete("/usuario/:id", deleteUsersById)

export default userRouter
