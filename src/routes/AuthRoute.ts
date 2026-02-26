import { Router } from "express";
import { AuthController } from "../modules/users/controllers/AuthController";

const router = Router();
const context = "/auth";

router.post(context + "/register", AuthController.register);
router.post(context + "/login", AuthController.login);
router.get(context + "/me", AuthController.me);

export default router;
