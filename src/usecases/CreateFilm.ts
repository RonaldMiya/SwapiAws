import { v4 as uuid } from 'uuid';
import { FilmRepository } from '../domain/repositories';
import { Film } from '../domain/entities';

interface Input {
  title: string;
  episodeId: number;
  openingCrawl: string;
  director: string;
  producer: string;
  releaseDate: string;
  fullName: string;
  releaseYear: string;
  imdbId: string;
  mainActors: string;
  imagePoster: string;
}

export class CreateFilm {
  constructor(
    private readonly filmRepository: FilmRepository
  ) { }

  async execute(input: Input): Promise<Film> {
    return await this.filmRepository.create(new Film(
      uuid(),
      input.title,
      input.episodeId,
      input.openingCrawl,
      input.director,
      input.producer,
      input.releaseDate,
      input.fullName,
      input.releaseYear,
      input.imdbId,
      input.mainActors,
      input.imagePoster,
      Date.now()
    ))
  }
}
