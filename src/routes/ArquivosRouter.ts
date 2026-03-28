import { Router } from "express";
import multer from "multer";
import authenticate from "../core/middlewares/Auth";
import { ArquivoController } from "../modules/arquivos/controllers/ArquivoController";

const router = Router();
const context = "/arquivos";

const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

router.get(`${context}/:pastaId`, ArquivoController.list);
router.get(`${context}/:id`, ArquivoController.getById);
router.post(`${context}/`, upload.single("file"), ArquivoController.create);
router.put(`${context}/:id`, ArquivoController.update);
router.delete(`${context}/:id`, ArquivoController.delete);

export default router;