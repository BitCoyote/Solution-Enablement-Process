# Front-End Env Variables (Also exposed to backend)
### General 
* REACT_APP_API_BASE_URL= The base url for the backend API service

### Oauth Settings
* REACT_APP_CLIENT_ID= Client ID of the application in Azure Active Directory
* REACT_APP_TENANT_ID= Tenant ID of the tenant in Azure Active Directory
* REACT_APP_REDIRECT_URI= The main redirect URI used for OAuth2.0, configured in the Azure Active Directory application
* REACT_APP_SILENT_REDIRECT_URI= An additional redirect URI used for silent renewal of tokens, configured in the Azure Active Directory application

### Back-End Env Variables
* API_PORT= The port to host the backend API service on
* CLIENT_SECRET= The client secret for the application in Azure Active Directory