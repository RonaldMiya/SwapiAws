import { FilmRepository } from "../domain";
import { Film } from "../domain/entities";

export class AllFilm {
  constructor(
    private readonly filmRepository: FilmRepository
  ) { }

  async execute(): Promise<{ items: Film[]; total: number }> {
    return await this.filmRepository.getAll()
  }
}
