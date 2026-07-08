import multer from "multer";
import { Router } from "express";
import { BackofficeAuthController } from "../modules/users/controllers/BackofficeAuthController";
import { BackofficeUsersController } from "../modules/users/controllers/BackofficeUsersController";
import { BackofficeEmpresasController } from "../modules/empresas/controllers/BackofficeEmpresasController";
import { BackofficeDashboardController } from "../modules/dashboard/BackofficeDashboardController";
import authenticateBackoffice from "../core/middlewares/BackofficeAuth";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();
const context = "/backoffice";

router.post(context + "/login", BackofficeAuthController.login);

router.get(context + "/dashboard/stats", authenticateBackoffice, BackofficeDashboardController.stats);

router.get(context + "/usuarios", authenticateBackoffice, BackofficeUsersController.list);
router.patch(context + "/usuarios/:id", authenticateBackoffice, BackofficeUsersController.update);
router.patch(context + "/usuarios/:id/reset-senha", authenticateBackoffice, BackofficeUsersController.resetSenha);

router.get(context + "/escritorios", authenticateBackoffice, BackofficeEmpresasController.list);
router.post(context + "/escritorios", authenticateBackoffice, BackofficeEmpresasController.create);
router.patch(context + "/escritorios/:id", authenticateBackoffice, BackofficeEmpresasController.update);
router.patch(context + "/escritorios/:id/logo", authenticateBackoffice, upload.single("logo"), BackofficeEmpresasController.updateLogo);
router.delete(context + "/escritorios/:id/logo", authenticateBackoffice, BackofficeEmpresasController.removeLogo);

export default router;
