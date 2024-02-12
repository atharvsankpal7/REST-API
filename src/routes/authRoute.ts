import express from "express";
import { registerUser, login } from "../controller/authentication";
export default (router: express.Router) => {
    router.post("/auth/login", login);
    router.post("/auth/register", registerUser);
};
