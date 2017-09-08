# Blockstreet API
The backend API and services that power the Blockstreet web application.

## Setup
The first step as always is to clone the repository:
```
git clone https://github.com/blockstreet/api.git
```

To get the API up and running, you need to have nodeJS installed (preferably `v8.4.0`, required > `v6.11.3 (LTS)`). Doing this should also give you the node package manager "npm" which we highly suggest you update to at least `v5.3.0` as it is much faster than previous versions.

## Installation
If that is all set, we want to install the project's dependencies through our node package manager:
```
npm install
```

After this a post-install script will automatically run that sets an environment variable so a module we use to detect environment variables can find well...the environment variables. This script will also generate a configuration file for each environment type (development, staging, production) in the `./configuration` directory.

## Configuration
The JSON environment files are not tracked in version control for security purposes. It is best practice to never commit potentially sensitive information to version control systems such as Github. This information is supposed to be stored in secure place like a project-wide password manager. This currently does not exist but will be implemented in the future. 

## Execution
After filling in the proper environment variables, you may run the API using the following command (associated with your environment):
```
npm run start:development
npm run start:staging
npm run start:production
```

And that's it! Logging will output to the `./logs` directory in the root of the repository (as well as console of course).

## Persistence
In production we use the node module `pm2` to persist node processes so they aren't killed when the SSH connection that starts them closes. Normally, pm2 can only be used to execute raw node files, and we use ES7 which would disallow this. The workaround for this is running an npm script through pm2.
