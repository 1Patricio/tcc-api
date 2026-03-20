
import { Router } from "express";
import authenticate from "../core/middlewares/Auth";
import { PastaController } from "../modules/pasta/controllers/PastaController";
import { uploadFile, deleteFile } from "../controllers/s3controller";

const router = Router();
const context = "/pastas"

router.use(authenticate);

router.get(context + "/", authenticate, PastaController.get);
router.get(context + "/:id", authenticate, PastaController.getById);

// Upload de arquivo
router.post("/upload", async (req, res) => {
  const result = await uploadFile({
    fileName: req.file.originalname,
    fileType: req.file.mimetype,
    buffer: req.file.buffer
  });
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});


// Excluir arquivo
router.delete("/delete/:fileName", async (req, res) => {
  const result = await deleteFile(req.params.fileName);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;