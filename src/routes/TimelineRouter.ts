import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { TimelineController } from "../modules/timelines/controllers/TimelineController";

const router = Router();

// Rota pública — autenticada por PIN (4 últimos chars do numeroProcesso)
router.get("/timeline/publica/:processoId", TimelineController.getPublic);

// Rotas protegidas — advogado autenticado
router.get("/timeline/resumo", authenticate, TimelineController.resumo);
router.get("/processos/:processoId/timeline", authenticate, TimelineController.listByProcesso);
router.post("/processos/:processoId/timeline", authenticate, TimelineController.create);
router.put("/timeline/:id", authenticate, TimelineController.update);
router.delete("/timeline/:id", authenticate, TimelineController.remove);

export default router;
