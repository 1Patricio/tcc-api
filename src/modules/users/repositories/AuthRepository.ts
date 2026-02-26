import { AppDataSource } from "../../../data";
import { User } from "../models/User";

export const AuthRepository = AppDataSource.getRepository(User);