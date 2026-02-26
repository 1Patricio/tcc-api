import { AppDataSource } from "../../../data";
import { Processo } from "../models/Processo";

export const ProcessoRepository = AppDataSource.getRepository(Processo)