export interface SwapiService {
  fetchDataFromApi(id: string): Promise<any | null>;
}
