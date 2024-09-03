# WorkHive NestJS

## Description

WorkHive is a dynamic Job Searching Website built to bridge the gap between Students seeking opportunities and Recruiters looking for talent. Developed with a robust backend using TypeScript, NestJS, and Prisma, WorkHive provides a seamless experience for both job seekers and recruiters.

## Tech Used

- `Typescript` JS superset, enables strict type checking
- `Nest JS` Backend Framework Based on ExpressJS
- `Prisma` TS ORM
- `PostgresSQL` SQL Database
- `Zod` TS Schema Validation Library for Pipes
- `Cloudinary` Cloud Storage
- `Docker` Containerized the Application

## Set-Up this Project Locally

### `Node JS`

1. First clone this project locally.

   ```bash
   git clone https://github.com/Sahil2k07/WorkHive-NestJS.git
   ```

2. Move to the project directory.

   ```bash
   cd WorkHive-NestJS
   ```

3. Install all the dependencies.

   ```bash
   npm i
   ```

4. Set up all the required env variable by making a `.env` file. A `.env.example` file has been given for reference.

   ```dotenv
    PORT=3000

    DATABASE_URL="postgresql://<YOUR_USERNAME>:<YOUR_PASSWORD>@localhost:5432/<DB_NAME>?schema=public"

    JWT_SECRET=

    # Cloudinary Details.
    CLOUD_NAME=
    API_KEY=
    API_SECRET=
    FOLDER_NAME=

    BCRYPT_ROUNDS=
   ```

5. Run the command to `CREATE TABLES` in your Database.

   ```bash
   npx prisma migrate deploy
   ```

6. Run the command to generate `Prisma Client`.

   ```bash
   npx prisma generate
   ```

7. Run the command to Start the project in Watch Mode.

   ```bash
   npm run start:dev
   ```

8. Run the command to Build End Version of the Project.

   ```bash
   npm run build
   ```

9. Run the command to Start the Build Version of the Project.

   ```bash
   npm start
   ```

### `Docker`

1. First clone this project locally.

   ```bash
   git clone https://github.com/Sahil2k07/WorkHive-NestJS.git
   ```

2. Move to the project directory.

   ```bash
   cd WorkHive-NestJS
   ```

3. Set the Cloudinary Details in the `.env` file

   ```dotenv
   # Cloudinary Details.
    CLOUD_NAME=
    API_KEY=
    API_SECRET=
    FOLDER_NAME=
   ```

4. Run the command to start your Containerized Application

   ```bash
   docker-compose up
   ```

   or

   ```bash
   docker-compose up -d
   ```

5. If you have Docker Compose Plugin, Use this command instead

   ```bash
   docker compose up
   ```

   or

   ```bash
   docker compose up -d
   ```
