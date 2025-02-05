import { Film } from "../entities";

export interface FilmRepository {
  getAll(): Promise<{ items: Film[]; total: number }>;
  create(film: Film): Promise<Film>;
}
