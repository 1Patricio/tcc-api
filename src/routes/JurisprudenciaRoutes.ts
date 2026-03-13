import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { JurisprudenciaController } from "../modules/jurisprudencias/controllers/JurisprudenciaController";

const router = Router();
const context = "/jurisprudencias"

router.use(authenticate);

router.get(context + "/:processoId", authenticate, JurisprudenciaController.list);
router.post(context + "/", authenticate, JurisprudenciaController.create);
router.delete(context + "/:id", authenticate, JurisprudenciaController.delete);
router.post("/busca-rs", JurisprudenciaController.buscaRs);

export default router;