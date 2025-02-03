# Proyecto Swapi

Este prouyecto está construido con **CDK**, **Lambda**, **API Gateway** y **AWS DynamoDB**.

La API permite interactuar con las APIs de **SWAPI** y **FM-DB API** para combinarlas y obtener un resultado único, a su vez se implementaron algunas rutas para su interacción.

## Características

- **Integración con SWAPI**: Obtén información de las películas.
- **Integración con FM-DB API**: Obtén información de las películas de starwars en IMDB.
- **AWS DynamoDB**: Crea y consulta los datos almacenados en la base de datos, asi como implementa el sistema de cache.
- **CDK**: Framework de AWS que permite implementar la infraestructur de AWS usando lenguajes de programación como TS.
- **Endpoints REST**: Existen tres endpoints solicitados para este reto.

## Instalación

Para clonar y ejecutar este proyecto localmente, sigue estos pasos:

1. Clona este repositorio:

   ```bash
   git clone https://github.com/RonaldMiya/SwapiAws
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Deberá de configurar una cuenta en el CLI de AWS y posterior a ello instalar CDK:

   - AWS CDK: Podrá configurar AWS con el siguiente [enlace](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html).
   - Si quiere ejecutar el proyecto mediante algún perfil creado en AWS CLI deberá de dirigirse al archivo `cdk.json` y agregar `"profile": "MY_PROFILE"`.

3. Para levantar el proyecto deberá de ejecutar el siguiente comando:
   ```bash
   npm run cdk deploy
   ```

## Endpoints

1. **Obtener personajes de DynamoDB:**

   ```bash
   GET /fusionados/{ID}
   ```
   El **ID** deberá de ser algún film almacenado en la API de SWAPI.

   - **Descripción**: Fusiona los datos obtenidos de las apis **SWAPI** y **FM-DB API** en un solo modelo llamado Film que esa almacenado en una tabla de DynamoDB. También guarda provicionalmente la respuesta de las apis en una tabla de DynamoDB que se elimina posterior a los 30 mins.

   - **Respuesta**:
    ```json
     {
        "data": {
            "title": "The Empire Strikes Back",
            "episodeId": 5,
            "openingCrawl": "It is a dark time for the\r\nRebellion. Although the Death\r\nStar has been destroyed,\r\nImperial troops have driven the\r\nRebel forces from their hidden\r\nbase and pursued them across\r\nthe galaxy.\r\n\r\nEvading the dreaded Imperial\r\nStarfleet, a group of freedom\r\nfighters led by Luke Skywalker\r\nhas established a new secret\r\nbase on the remote ice world\r\nof Hoth.\r\n\r\nThe evil lord Darth Vader,\r\nobsessed with finding young\r\nSkywalker, has dispatched\r\nthousands of remote probes into\r\nthe far reaches of space....",
            "director": "Irvin Kershner",
            "producer": "Gary Kurtz, Rick McCallum",
            "releaseDate": "1980-05-17",
            "fullName": "Star Wars: Episode V - The Empire Strikes Back",
            "imdbId": "tt0080684",
            "mainActors": "Mark Hamill, Harrison Ford",
            "imagePoster": "https://m.media-amazon.com/images/M/MV5BMTkxNGFlNDktZmJkNC00MDdhLTg0MTEtZjZiYWI3MGE5NWIwXkEyXkFqcGc@._V1_.jpg"
        }
     }
     ```

2. **Obtener el Historial de respuestas almacenadas:**

   ```bash
   GET /historial
   ```

   - **Descripción**: Recupera todas las búsquedas realizadas usando al ruta **/fusionados/{ID}**.

   - **Respuesta** (Ejemplo):

    ```json
     {
        "data": [
            {
                "imagePoster": "https://m.media-amazon.com/images/M/MV5BOGUwMDk0Y2MtNjBlNi00NmRiLTk2MWYtMGMyMDlhYmI4ZDBjXkEyXkFqcGc@._V1_.jpg",
                "director": "George Lucas",
                "producer": "Gary Kurtz, Rick McCallum",
                "releaseDate": "1977-05-25",
                "episodeId": 4,
                "timestamp": 1738563142274,
                "openingCrawl": "It is a period of civil war.\r\nRebel spaceships, striking\r\nfrom a hidden base, have won\r\ntheir first victory against\r\nthe evil Galactic Empire.\r\n\r\nDuring the battle, Rebel\r\nspies managed to steal secret\r\nplans to the Empire's\r\nultimate weapon, the DEATH\r\nSTAR, an armored space\r\nstation with enough power\r\nto destroy an entire planet.\r\n\r\nPursued by the Empire's\r\nsinister agents, Princess\r\nLeia races home aboard her\r\nstarship, custodian of the\r\nstolen plans that can save her\r\npeople and restore\r\nfreedom to the galaxy....",
                "imdbId": "tt0076759",
                "fullName": "Star Wars: Episode IV - A New Hope",
                "id": "4f88d2a3-6352-498a-8ed3-eee6c2208597",
                "mainActors": "Mark Hamill, Harrison Ford",
                "title": "A New Hope"
            },
            ...
        ]
     }
    ```

3. **Crear un nuevo usuario en DynamoDB:**

   ```bash
   POST /almacenar
   ```

   - **Descripción**: Crea un nuevo usuario en DynamoDB.

   - **Body** (Ejemplo):

     ```json
     {
        "name": "María",
        "lastName": "Castro",
        "email": "maria.castro@gmail.com"
     }
     ```

   - **Respuesta** (Ejemplo):

     ```json
     {
       "message": "OK",
       "id": "8343113b-342f-4f62-891d-5615642dabaa"
     }
     ```