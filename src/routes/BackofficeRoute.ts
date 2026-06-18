import { Router } from "express";
import { BackofficeAuthController } from "../modules/users/controllers/BackofficeAuthController";

const router = Router();
const context = "/backoffice";

router.post(context + "/login", BackofficeAuthController.login);

export default router;
