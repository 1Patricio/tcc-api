import { Router } from "express";
import multer from "multer";
import { AuthController } from "../modules/users/controllers/AuthController";
import authenticate from "../core/middlewares/Auth";

const router = Router();
const context = "/auth";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post(context + "/register", AuthController.register);
router.post(context + "/login", AuthController.login);
router.get(context + "/me", AuthController.me);
router.put(context + "/perfil", authenticate, upload.single("foto"), AuthController.updatePerfil);

export default router;
