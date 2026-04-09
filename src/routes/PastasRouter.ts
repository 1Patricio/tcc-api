import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { PastaController } from "../modules/pasta/controllers/PastaController";

const router = Router();
const context = "/pastas"

router.use(authenticate);

router.get(context + "/", PastaController.get);
router.get(context + "/:id", PastaController.getById);

export default router;