import express from "express";
import authRoute from "./authRoute";
import users from "./users";
const router = express.Router();
export default (): express.Router => {
    authRoute(router);
    users(router);
    return router;
};
