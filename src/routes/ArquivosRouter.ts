import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { ArquivoController } from "../modules/arquivos/controllers/ArquivoController";

const router = Router();
const context = "/arquivos"

router.use(authenticate);

router.get(context + "/:pastaId", authenticate, ArquivoController.list);
router.get(context + "/:id", authenticate, ArquivoController.getById);
router.post(context + "/", authenticate, ArquivoController.create);
router.put(context + "/:id", authenticate, ArquivoController.update);
router.delete(context + "/:id", authenticate, ArquivoController.delete);

export default router;