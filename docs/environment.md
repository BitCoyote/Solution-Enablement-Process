# Env Variables
### General
* REACT_APP_API_BASE_URL= The base url for the backend API service

### Oauth Settings
* REACT_APP_CLIENT_ID= Client ID of the application in Azure Active Directory
* REACT_APP_TENANT_ID= Tenant ID of the tenant in Azure Active Directory
* REACT_APP_REDIRECT_URI= The main redirect URI used for OAuth2.0, configured in the Azure Active Directory application

### Back-End Env Variables
* API_PORT= The port to host the backend API service on
* CLIENT_SECRET= The client secret for the application in Azure Active Directory

### SQL Server
* SQL_SERVER_HOST= The hostname of the SQL server to connect to.
* SQL_SERVER_USER = The login username for the SQL Server user. Defaults to `sepdba`
* SQL_SERVER_PASS= SQL Server pass should be stored in Azure key vault or in system env variables for non-local environments
* SQL_SERVER_PORT= SQL Server port number. Defaults to `1433`
* SQL_SERVER_DB= The name of the SQL Server database.
* SQL_SERVER_DIALECT= SQL Server dialect to use for the database. Usually `mssql` for running the application or `sqlite` for automated testing

### Automated Testing
* BYPASS_AUTH= When true, skips token validation on the backend authentication middleware. Defaults to `false`.
* TESTING_USER= The testing user used for non-mocked calls to the Microsoft API during tests. This should always be a user on a developer tenant.
* TESTING_PASS= The password for the testing user.
