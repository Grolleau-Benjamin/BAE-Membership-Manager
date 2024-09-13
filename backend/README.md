# BAE App Backend with NestJS

This project is a RESTful API built using the [NestJS](https://nestjs.com/) framework, utilizing Mongoose for MongoDB management and JWT for authentication.

## Usage
1. Install dependencies
  ```bash
  npm i
  ```
2. Configure the environment variables in the `.env.yaml` file.
  ```yml
  jwt: 
    secret: <string> Should be long
  mongoose:
    port: <number>{3007} db listening port
    dbName: <string> db name
    user: <string> user for the db login
    password: <string> password for the db login
  ```
  Be careful with the mongoose part, the environment variables must match the database environment variables.

3. Start the project
  ```bash
  npm run start
  ```
  Or in development mode with hot-reload
  ```bash
  npm run start:dev
  ```

## Available Routes
### Authentication
- **POST /auth/login**: Authenticate the user with Bordeaux-INP's CAS and return a JWT token.

### Users
- **POST /users**: Create a new user.
- **PATCH /users/id**: Update a user by their ID.
- **GET /users**: Get the list of all users.
- **GET /users/id**: Get a specific user by their ID.
- **DELETE /users/id**: Delete a specific user by their ID.

### Adherents
- **POST /adherents**: Create a new adherent. 
- **PATCH /adherents/id**: Update an adherent by their ID.
- **GET /adherents**: Get the list of all adherents.  
- **GET /adherents/id**: Get a specific adherent by their ID.
- **DELETE /adherents/id**: Delete a specific adherent by their ID.

## Technologies Used
- [NestJS](https://nestjs.com/) - A Node.js framework for building efficient, scalable applications.
- MongoDB with [Mongoose](https://docs.nestjs.com/techniques/mongodb) for database management.
- [JWT](https://docs.nestjs.com/security/authentication#jwt-token) for secure authentication.
