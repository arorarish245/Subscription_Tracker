import {Router} from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

const authRouter=Router();

//Path:/api/v1/auth/sign-up
authRouter.post("/sign-up",signUp);
authRouter.post("/sign-in",signIn);
authRouter.post("/sign-out",signOut);

export default authRouter;