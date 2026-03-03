import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { ClienteController } from "../modules/clientes/controllers/ClienteController";

const router = Router();
const context = "/clientes"

router.use(authenticate);

router.get(context + "/", authenticate, ClienteController.get);
router.get(context + "/:id", authenticate, ClienteController.getById);
router.post(context + "/", authenticate, ClienteController.create);
router.put(context + "/:id", authenticate, ClienteController.update);
router.delete(context + "/:id", authenticate, ClienteController.delete);

export default router;