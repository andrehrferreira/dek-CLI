# @dekproject/CLI

CLI for Dek

What does the CLI do?

* Create a base project
* Has an optional base skeleton to facilitate the development (https://github.com/dekproject/boostrap)
* Installs development components (cross-env, mocha, nodemon, babel, etc)
* Configure Webpack and Babel for ES6 (client and server)
* It has plugins for basic services (mongodb, redis, authentication, etc)
* Set up production and development environment for Angular, React and Nuxt
* Generates configuration file for Docker and Docker-compose
* Be happy =)

## Instalation

To start using the CLI you will first need to download in NPM using the following command

```bash
$ npm i -g @dekproject/cli
```

## Create new project

```bash
$ dek init
```

The CLI will ask you some questions for configuring the **package.json** and **.git**.

```
? What is the name of the project? myproject
? What is the author's name?
? What is the project description? Another DEK project
? What is the version of the project? 1.0.0
? Directory for your project: /media/Dek/CLI/myproject
? What is the repository of this project? https://github.com/dekproject/CLI
? Do you want to use default skeleton? [Yes/No]
? Do you want to install components for development mode? [Yes/No]
? Do you want to install some frontend framework? [nuxt/angular/react]
```

### Skeleton

What does the skeleton do?

* Create a basic HTTP server with Express (https://www.npmjs.com/package/express)
* Set up the Babel build environment (https://babeljs.io/)
* Structure in ES6 build by Babel
* Configuration control via dotenv (https://www.npmjs.com/package/dotenv)

For more information access: https://github.com/dekproject/boostrap

### Frontend / Proxy

When creating a CLI deployment project, an installation of the Nuxt, Angular or React frontend framework will be offered, as shown below, as well as the DEK skeleton the system will request additional configuration parameters.

```
? Define which port will be the backend: 5555
? Do you want to create a frontend proxy? [Yes/No]
? What will be the backend path? /api
```

Currently each framework has its own peculiarities in relation to the build and mode of development so in this case with the help of the module **concurrently (https://www.npmjs.com/package/concurrently)** will be added two servers, one containing the routes of API with Express, another containing the framework chosen, so that there is no need of later configurations and it is possible to create a proxy between the connections where the route is defined as the default backend "/api" will be of the DEK skeleton and the route "/" will be of the frontend. To create the proxy the system uses the module **express-http-proxy (https://www.npmjs.com/package/express-http-proxy)**.

To access the development environment using proxy, simply access the following address varying according to the port informed, **default 5555**

```
Frontend - http://localhost:5555/
API - http://localhost:5555/api
```

We recommend that this configuration in production be done through Nginx or any other server of your preference, to facilitate the publication it is possible to use the command:

```bash
$ dek publish
```

### Help

```bash
$ dek [help/h/?]
```
