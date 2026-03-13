import { AppDataSource } from "../../../data";
import { Peticao } from "../models/Peticao";

export const PeticaoRepository = AppDataSource.getRepository(Peticao)