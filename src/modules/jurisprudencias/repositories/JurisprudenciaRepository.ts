import { AppDataSource } from "../../../data";
import { Jurisprudencia } from "../models/Jurisprudencia";

export const JurisprudenciaRepository = AppDataSource.getRepository(Jurisprudencia)