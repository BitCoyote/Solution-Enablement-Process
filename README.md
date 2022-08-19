# Constellation - Just Enough Governance 

* This repository contains both the backend and frontend code for the Constellation "Just Enough Governance" Web Application.

## Front-End 
* Typescript
* React
* Redux
* Jest
* React Testing-Library
* Cypress

## Back-End
* Typescript
* NodeJS v 
* Express
* SQL Server
* Sequelize
* Jest
* React Testing-Library

## Testing

## Local Development

If this is your first time setting up the application please see the [Local Environment Setup](#local-environment-setup) section to set up your local database.

Ensure you are using Node v16.6.0  by typing `node -v` in your terminal. ([Use NVM to manage separate Node versions!](https://github.com/nvm-sh/nvm))

From the project root folder, run `npm install` to install dependencies for both frontend and backend.

Ensure your database has the latest structure by running `npm run migrate` in your terminal.

Ensure your database has the latest seeded data by running `npm run seed` in your terminal.

To start the backend, run `npm run dev-backend` in your terminal.

To start the frontend, run `npm run dev-frontend` in a separate terminal. (`npm run dev-frontend:win` if you are on Windows)


### Local Environment Setup

Install SQL Server on your machine.
* For MacOS:
 * [Article for installing SQL Server on MacOS via docker container](https://adamwilbert.com/blog/2018/3/26/get-started-with-sql-server-on-macos-complete-with-a-native-gui)
 * The repository contains a [docker-compose.yml](docker-compose.yml)
 for running a SQL server on MacOS.
* For Windows:
 * Install [SQL Server Developer Edition](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
 *Additionally, [SSMS is recommended](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms?view=sql-server-ver15).

Setup your local database server and database.
* Create a SQL Server login user named `jegdba` with owner permissions.
* Create a database called `jeg-db`.
* Under "Protocols for MSSQLServer" in SQL Server Configuration Manager:
 * Enable TCP/IP connections 
 * Open your database port (1433 by default)

Setup your local environment variables.
* Create a file called `.env` in your root project directory.
* Copy the contents from `.env.sample` to `.env`.
* Update any environment variable values as needed.