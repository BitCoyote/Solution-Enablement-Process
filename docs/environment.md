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
* SQL_SERVER_MODE= Usually `default` but could be `ntlm`
* SQL_SERVER_DOMAIN= Used for NTLM connection modes only. Defaults to `constellation`
* SQL_SERVER_USER = The login username for the SQL Server user. Defaults to `jegdba`
* SQL_SERVER_PASS= SQL Server pass should be stored in Azure key vault or in system env variables for non-local environments
* SQL_SERVER_PORT= SQL Server port number. Defaults to `1433`
* SQL_SERVER_DB= The name of the SQL Server database. 
* SQL_SERVER_INSTANCE_NAME= Name of the SQL server instance. Only necessary if dialect options for server require it.
* SQL_SERVER_DIALECT= SQL Server dialect to use for the database. Usually `mssql` for running the application or `sqlite` for automated testing

### Automated Testing
* BYPASS_AUTH= When true, skips token validation on the backend authentication middleware. Defaults to `false`. 