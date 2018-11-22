# LOF Api

[![circleB]][circleL]
[![prettierB]][prettierL]

## About

This API is built in Koa.js framework using MongoDB for [this mobile app](https://github.com/fnmendez/lof-mobile-app).
Together they provide an instant bike rental service handling users, bikes and trips.
There are 3 kind of route, each one adds one security filter making use of Koa middlewares.
1. Public: Authentication happens here.
2. Admin: Manages users and sensitive data.
3. Private routes: bikes and trips are offered here.

## Index

- [Development](#development)
- [Environment variables](#environment-variables)
- [Endpoints](#endpoints)
  - [User](#user)
    - [Sign up](#sign-up)
    - [Confirm user](#confirm-user)
    - [Login](#login)
    - [Update password](#update-password)
    - [Recover password](#recover-password)
    - [Delete user](#delete-user)
    - [Get user](#get-user)
  - [Bikes](#bikes)
    - [Get available bikes](#get-available-bikes)
    - [Get trips](#get-trips)
    - [Start trip](#start-trip)
    - [Finish trip](#finish-trip)
  - [Admin](#admin)
    - [Get user by email](#get-user-by-email)
    - [Add balance](#add-balance)
    - [Update bike](#update-bike)
- [Author](#author)

## Development

For development, run this commands so you clone the repo, install dependencies and start a local server

```bash
git clone https://github.com/fnmendez/lof-api
cd lof-api
yarn
yarn dev
```

Don't forget to set the environment variables exposed next.
You can do this making use of [direnv](https://github.com/direnv/direnv) and the `.envrc.example` file.

## Environment variables

|variable|default|use|
|:-:|:-:|:-:|
|PORT|3000|Port in which the API is exposed|
|API_URI|http://localhost:3000|URI where this API is accessed from|
|API_SECRET||Secret used for security|
|BIKES_API_URI||URI where we know bikes' locations|
|BIKES_API_USER||User for bikes API|
|BIKES_API_TOKEN||Token for bikes API|
|BIKES_API_RUBI_ID||Id for bikes API|
|BIKES_API_RADIUS|80|Radius to look for bikes from location|
|MAIL_NAME|LOF Test Mail|Name to show in emails|
|MAIL_USER|lofdevtest@gmail.com|The email address|
|MAIL_PASSWORD|loftest123|Email's password|
|MAX_REQUEST_TIMEOUT|15000|Seconds for timeout for requests|

## Endpoints

### User

#### Sign up

- Route: `POST` `/signup`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
  	"firstName": "Franco",
  	"lastName": "Méndez",
  	"mail": "fnmendez@uc.cl",
  	"password": "pass1234"
  }
  ```

- Success Response:

  - Status: 201
  - Content:

    ```javascript
    {
      "balance": 0,
      "confirmed": false,
      "firstName": "Franco",
      "lastName": "Méndez",
      "mail": "fnmendez@uc.cl",
      "token": "<user-token>"
      }
    ```

- Error Response:

  - Code: 406
  - Content:

    ```javascript
    { "mail": "El correo electrónico ya está en uso" }
    ```

***

#### Confirm user

- Route: `GET` `/confirm/<user-token>/<confirmation-token>`

- Headers:
  - Secret: `<api-secret>`

- Success Response:

  - Status: 200
  - Content-Type: `html`

- Error Response:

  - Code: 400
  - Content:

    ```javascript
    { "message": "Ya estás confirmado" }
    ```

***

#### Login

- Route: `POST` `/login`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "mail": "fnmendez@uc.cl",
    "password": "pass1234"
  }
  ```

- Success Response:

  - Status: 200
  - Content:

    ```javascript
    {
      "balance": 1400,
      "confirmed": true,
      "firstName": "Franco",
      "lastName": "Méndez",
      "mail": "fnmendez@uc.cl",
      "token": "<user-token>",
      "bike": null,
      "trip": null
    }
    ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "Credenciales inválidas" }
    ```

***

#### Update password

- Route: `PATCH` `/user/<user-token>`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "oldPassword": "pass1234",
    "newPassword": "new1234"
  }
  ```

- Success Response:

  - Status: 200
  - Content:

    ```javascript
    {
      "message": "Tu contraseña ha sido actualizada"
    }
    ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "Credenciales inválidas" }
    ```

***

#### Recover password

- Route: `PATCH` `/user/<user-email>/recover`

- Headers:
  - Secret: `<api-secret>`

- Success Response:

  - Status: 200
  - Content:

    ```javascript
    {
      "message": "Se te ha enviado un email con tu nueva contraseña"
    }
    ```

- Error Response:

  - Code: 400
  - Content:

    ```javascript
    { "message": "No se ha encontrado un usuario" }
    ```

***

#### Delete user

- Route: `DELETE` `/user/<user-token>`

- Headers:
  - Secret: `<api-secret>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  { "message": "Se ha eliminado el usuario exitosamente" }
  ```

- Error Response:

  - Code: 400
  - Content:

    ```javascript
    { "message": "No se ha encontrado el usuario a eliminar" }
    ```

***

#### Get user

- Route: `GET` `/user/<user-token>`

- Headers:
  - Secret: `<api-secret>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "balance": 1400,
    "confirmed": true,
    "firstName": "Franco",
    "lastName": "Méndez",
    "mail": "fnmendez@uc.cl",
    "token": "<user-token>",
    "bike": {<Bike>},
    "trip": {<Trip>}
  }
  ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "Sesión inválida" }
    ```

***

### Bikes

#### Get available bikes

- Route: `GET` `/bikes/<latitude>/<longitude>`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`
  - Authorization: `<user-token>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "bikes": [
        {
            "rubi_id": 337,
            "coordinates": [
                "<longitude>",
                "<latitude>"
            ],
            "macIOS": "<macIOS>",
            "macAndroid": "<macAndroid>",
            "hs1": "<hs1>",
            "hs2": "<hs2>"
        },
        {
            "rubi_id": 229,
            "coordinates": [
                "<longitude>",
                "<latitude>"
            ],
            "macIOS": "<macIOS>",
            "macAndroid": "<macAndroid>",
            "hs1": "<hs1>",
            "hs2": "<hs2>"
        }
    ],
    "interval": 2000
  }
  ```

- Error Response:

  - Code: 403
  - Content:

    ```javascript
    { "message": "Cuenta no confirmada" }
    ```

***

#### Get trips

- Route: `GET` `/trips`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`
  - Authorization: `<user-token>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "trips": [
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 21,
            "cost": 300,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 122,
            "cost": 200,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 300,
            "cost": 600,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        }
    ]
  }
  ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "Credenciales inválidas" }
    ```

***

#### Start trip

- Route: `POST` `/trips/<rubi_id>`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`
  - Authorization: `<user-token>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "trips": [
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 21,
            "cost": 300,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 122,
            "cost": 200,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 300,
            "cost": 600,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        }
    ]
  }
  ```

- Error Response:

  - Code: 403
  - Content:

    ```javascript
    { "message": "No tienes saldo" }
    ```

***

#### Finish trip

- Route: `PATCH` `/trips`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`
  - Authorization: `<user-token>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "trips": [
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 21,
            "cost": 300,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 122,
            "cost": 200,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        },
        {
            "_id": "<trip-id>",
            "updatedAt": "<Date>",
            "createdAt": "<Date>",
            "userId": "<user-id>",
            "rubi_id": 300,
            "cost": 600,
            "finishedAt": "<Date>",
            "startedAt": "<Date>"
        }
    ]
  }
  ```

- Error Response:

  - Code: 400
  - Content:

    ```javascript
    {
      "message": "No tienes viajes sin finalizar"
    }
    ```

***

### Admin

#### Get user by email

- Route: `GET` `admin/users/<user-email>`

- Headers:
  - Secret: `<api-secret>`

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "balance": 1400,
    "confirmed": true,
    "firstName": "Franco",
    "lastName": "Méndez",
    "mail": "fnmendez@uc.cl",
    "confirmPath": "<confirm-path>"
    "token": "<user-token>",
    "bike": {<Bike>},
    "trip": {<Trip>}
  }
  ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "No autorizado" }
    ```

***

#### Add balance

- Route: `PATCH` `admin/users`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "mail": "fnmendez@uc.cl",
    "amount": "2400"
  }
  ```

- Success Response:

  - Status: 200
  - Content:

  ```javascript
  {
    "message": "Se ha añadido $2.400 de saldo a fnmendez@uc.cl"
  }
  ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "No autorizado" }
    ```

***

#### Update bike

- Route: `PATCH` `admin/bikes/<rubi_id>`

- Headers:
  - Secret: `<api-secret>`
  - Content-Type: `application/json`

- Example Body:

  ```javascript
  {
    "firstHandshake": "e8a9ad38271968ab76c2a229834937685817a9",
    "secondHanshake": "2a229834937685817a9e8a9ad38271968ab76c"
    "macIOS": "1A0C18AA-B29A-930A-4711-0655F2181F34",
    "macAndroid": "22:1A:3B:1A:AD:D2"
  }
  ```

- Success Response:

  - Status: 200
  - Content:

  ```javascript
    {
    "bike": {
        "_id": "<bike-id>",
        "updatedAt": "<Date>",
        "createdAt": "<Date>",
        "rubi_id": 1,
        "lat": <latitude>,
        "lon": <longitude>,
        "lastLockedDate": "<Date>",
        "lastUnlockDate": "<Date>",
        "lastUserId": "<user-id>",
        "secondHandshake": "<secondHanshake>",
        "firstHandshake": "<firstHandshake>",
        "macAndroid": "<macAndroid>",
        "macIOS": "<macIOS>",
        "available": true
      }
    }
  ```

- Error Response:

  - Code: 401
  - Content:

    ```javascript
    { "message": "No autorizado" }
    ```

***

## Author:

- [Franco Méndez Z.](https://github.com/fnmendez) - Only engineer to develop this API and the [mobile app](https://github.com/fnmendez/lof-mobile-app)

<!-- Badges -->

[prettierB]:https://img.shields.io/badge/code%20style-prettier-orange.svg
[prettierL]:https://github.com/prettier/prettier

[circleB]:https://circleci.com/gh/fnmendez/lof-api/tree/master.svg?style=svg&circle-token=241328d9014c85b082f3debb98c70183f6e40921
[circleL]:https://circleci.com/gh/fnmendez/lof-api/tree/master
