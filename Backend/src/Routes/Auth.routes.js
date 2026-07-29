import express from "express";
import { signup, login, logout,  refreshToken } from "../Controllers/Auth.controles.js";
import verifyToken from "../Middlewares/jwt.js";
import { delteaccount } from "../Controllers/Notes.controles.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/refresh", refreshToken);

// router.get("/verify", verify); // access token verify

router.delete("/delete-account", verifyToken, delteaccount);

export default router;