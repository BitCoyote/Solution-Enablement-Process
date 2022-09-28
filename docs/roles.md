# Roles

The following roles can be added in Azure AD Application Roles and are a 1:1 mapping to Departments, plus a couple of additional roles. A user with a department role can access that department's tab on an SEP.

* AuthLegal
* AuthEA
* AuthSecurity
* AuthThirdPartySecurity
* AuthNuclearCyberSecurity
* AuthSupply
* AuthPortfolioOwner
* AuthSolutionArchitect

* AuthSuperUser
* AuthRequestor

## Super User Role
Any user with the `AuthSuperUser` role has access to all of the application's functionality including all of the Department tabs.

NOTE: App Role values in Azure AD cannot contain spaces (i.e. NuclearCyberSecurity)