import { AppDataSource } from "../../../data";
import { Pasta } from "../models/Pasta";

export const PastaRepository = AppDataSource.getRepository(Pasta)