import { AppDataSource } from "../../../data";
import { Arquivo } from "../models/Arquivo";

export const ArquivoRepository = AppDataSource.getRepository(Arquivo)