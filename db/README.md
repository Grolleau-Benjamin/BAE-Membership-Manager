# MongoDB Database Setup for BAE App

This project sets up a MongoDB instance using Docker, along with initializing a database and collections. The `init-mongo.js.template` is used to create collections and insert initial data into the `baeAppDB` database.

## Prerequisites

Ensure that you have the following installed on your system:
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

## Environment Variables

You need to set up the following environment variables in a `.env` file:

```env
MONGO_PORT=3007
MONGO_INITDB_ROOT_USERNAME=root
MONGO_INITDB_ROOT_PASSWORD=root_password
MONGO_DB_NAME=db_name
MONGO_USER=user
MONGO_USER_PASSWORD=user_password
```

### Explanation of Environment Variables:
- `MONGO_PORT`: The port where MongoDB will run.
- `MONGO_INITDB_ROOT_USERNAME`: The root username for MongoDB.
- `MONGO_INITDB_ROOT_PASSWORD`: The root password for MongoDB.
- `MONGO_DB_NAME`: The name of the application database.
- `MONGO_USER`: The username that will be created for accessing the application database.
- `MONGO_USER_PASSWORD`: The password for the application user.

## How to Initialize the MongoDB Database

### Step 1: Prepare the Initialization Script
The `init-mongo.js.template` file is a template for initializing the database and its collections. The `init-mongo.sh` script will replace the environment variables in this template and generate the `init-mongo.js` script used to initialize the MongoDB instance.

### Step 2: Run the Initialization Script
To initialize the MongoDB database with the collections and seed data, follow these steps:

1. Ensure your `.env` file is set up with the correct values.
2. Run the following command to start the MongoDB instance and initialize the database:

   ```bash
   ./init-mongo.sh
   ```

This script will:
- Generate the `tmp/init-mongo.js` file by substituting the variables from the `.env` file into the `init-mongo.js.template`.
- Start the MongoDB instance using Docker Compose and run the initialization script inside the MongoDB container.

### Step 3: Confirm Initialization
After running the script, the MongoDB instance should be running with the `baeAppDB` database, and the following collections should be created:
- `adherents`
- `users`

The `users` collection will also have an initial admin user inserted with the following credentials:
- **Login**: `bgrolleau001`
- **Password**: `bgrolleau001`
- **Role**: `admin`

### Step 4: Running the Database
Once the database is initialized, you can run the MongoDB instance with:

```bash
docker-compose up
```

This will start the MongoDB container without re-running the initialization script.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
