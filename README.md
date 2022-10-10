# Constellation - Solution Enablement Process

This repository contains both the backend and frontend code for the Constellation "Solution Enablement Process" Web Application.

## Front-End
* [Typescript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Jest](https://jestjs.io/)
* [React Testing-Library](https://testing-library.com/docs/react-testing-library/intro)

## Back-End
* [Typescript](https://www.typescriptlang.org/)
* [NodeJS v16.17.1](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
* [Sequelize](https://sequelize.org/)
* [Jest](https://jestjs.io/)
* [Supertest](https://www.npmjs.com/package/supertest)

## Documentation
* [Testing](docs/testing.md)
* [Environment](docs/environment.md)

## Local Development

If this is your first time setting up the application please see the [Environment Setup](#environment-setup) section before proceeding.

Ensure you are using Node v16.17.1  by typing `node -v` in your terminal. Use [NVM](https://github.com/nvm-sh/nvm) or [NVM-Windows](https://github.com/coreybutler/nvm-windows) to manage separate Node versions!

From the project root folder, run `npm install` to install dependencies for both frontend and backend.

Ensure your database has the latest structure by running `npm run migrate` in your terminal.

Ensure your database has the latest seeded data by running `npm run seed` in your terminal.

To start the backend, run `npm run dev-backend` in your terminal.

To start the frontend, run `npm run dev-frontend` in a separate terminal. (`npm run dev-frontend:win` if you are on Windows)


### Environment Setup

Install SQL Server on your machine:

* For MacOS:
  * Make sure you have [Docker Desktop](https://docs.docker.com/desktop/install/mac-install/) installed.
  * You can start the database server by running `npm run docker:db:up`
  * You can stop the database server by running `npm run docker:db:down`
  * When you start the database server for the first time you will also need to run `npm run docker:db:init`. This will create the database from your `.env` settings. I recommend running as the SA user so that you don't need to worry about creating database users and permissions.
  * If you need to drop your local database, you can run `npm run docker:db:destroy`
  * `npm run docker:db:reset` will drop an existing database, recreate a new database, run migrations and seeds all in one command.
  * [Article for installing SQL Server on MacOS via docker container](https://adamwilbert.com/blog/2018/3/26/get-started-with-sql-server-on-macos-complete-with-a-native-gui)
  * The repository contains a [docker-compose.yml](docker-compose.yml)
 for running a SQL server on MacOS.
  * This docker compose uses image `mcr.microsoft.com/mssql/server:2022-latest` which requires [registration](https://info.microsoft.com/ww-landing-sql-server-2022.html?culture=en-us&country=US)
  * [Azure Data Studio](https://docs.microsoft.com/en-us/sql/azure-data-studio/download-azure-data-studio?view=sql-server-ver16) can be used to create a database.

* For Windows:
  * Install [SQL Server Developer Edition](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
  * Additionally, [SSMS is recommended](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15).
  * Once installed, under "Protocols for MSSQLServer" in SQL Server Configuration Manager:
    * Enable TCP/IP connections
    * Open your database port (1433 by default)
  * In SSMS, ensure "SQL Server and Windows Authentication mode" is enabled in the server Security settings.

Setup your local sql server login and database using Azure Data Studio or SSMS:

* Create a SQL Server login user with owner permissions and specify a password. (This must match SQL_SERVER_USER and SQL_SERVER_PASS in `.env`).
* Create a database called `sep_dev`.

Setup your local environment variables:

* Create a file called `.env` in your root project directory.
* Copy the contents from `.env.sample` to `.env`.
* Update any environment variable values as needed.
* See the [environment docs](docs/environment.md) for a breakdown of what each environment variable is used for.
