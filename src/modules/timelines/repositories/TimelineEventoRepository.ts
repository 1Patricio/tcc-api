import { AppDataSource } from "../../../data";
import { TimelineEvento } from "../models/TimelineEvento";

export const TimelineEventoRepository = AppDataSource.getRepository(TimelineEvento);
