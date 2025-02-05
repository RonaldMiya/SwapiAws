import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
    SWAPI_API_URL: get('SWAPI_API_URL').required().asString(),
    IMDB_API_URL: get('SWAPI_API_URL').required().asString()
}
