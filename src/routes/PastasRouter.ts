
import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { PastaController } from "../modules/pasta/controllers/PastaController";

const router = Router();
const context = "/pastas"

router.use(authenticate);

router.get(context + "/", authenticate, PastaController.get);
router.get(context + "/:id", authenticate, PastaController.getById);

export default router;