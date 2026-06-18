import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";
import { getPresignedUrl, uploadFile } from "../../../controllers/s3Controller";

function toS3Key(value: string): string {
  if (value.startsWith('http')) return new URL(value).pathname.slice(1);
  return value;
}

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, password } = req.body;
      const user = await AuthService.register(nome, email, password);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async updatePerfil(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) return res.status(401).json({ error: "Não autorizado" });

      const { nome, email, novaSenha } = req.body;

      let fotoKey: string | undefined;
      if (req.file) {
        const ext = req.file.originalname.split('.').pop();
        const key = `perfil/${userId}.${ext}`;
        const result = await uploadFile({
          fileName: req.file.originalname,
          fileNameKey: key,
          fileType: req.file.mimetype,
          buffer: req.file.buffer,
        });
        if (!result.success) return res.status(500).json({ error: result.message });
        fotoKey = result.data!.key;
      }

      const user = await AuthService.updatePerfil(userId, nome, email, novaSenha, fotoKey);
      if (user.fotoPerfil) {
        user.fotoPerfil = await getPresignedUrl(toS3Key(user.fotoPerfil));
      }
      return res.json({ user });
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ message: "Token não informado" });

      const user = await AuthService.userInfo(token);
      if (user.fotoPerfil) {
        user.fotoPerfil = await getPresignedUrl(toS3Key(user.fotoPerfil));
      }
      return res.json({ user });
    } catch {
      return res.status(401).json({ message: "Não autorizado" });
    }
  }
};
