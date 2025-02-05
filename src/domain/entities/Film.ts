export class Film {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly episodeId: number,
    readonly openingCrawl: string,
    readonly director: string,
    readonly producer: string,
    readonly releaseDate: string,
    readonly fullName: string,
    readonly releaseYear: string,
    readonly imdbId: string,
    readonly mainActors: string,
    readonly imagePoster: string,
    readonly timestamp: number
  ) { }
}
