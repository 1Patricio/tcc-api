import { Router } from "express";
import { UsuariosController } from "../modules/users/controllers/UsuariosController";
import authenticate from "../core/middlewares/Auth";

const router = Router();
const context = "/usuarios";

router.get(context, authenticate, UsuariosController.list);
router.get(context + "/:id", authenticate, UsuariosController.getById);
router.post(context, authenticate, UsuariosController.create);
router.put(context + "/:id", authenticate, UsuariosController.update);
router.patch(context + "/:id/senha", authenticate, UsuariosController.changeSenha);

export default router;
