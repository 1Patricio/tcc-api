import { AppDataSource } from "../../../data";
import { Empresa } from "../models/Empresa";

export const EmpresasRepository = AppDataSource.getRepository(Empresa);
