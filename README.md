# @dek/CLI

CLI for Dek

What does the CLI do?


* Create a base project
* Has an optional base skeleton to facilitate the development (https://github.com/dekproject/boostrap)
* Installs development components (cross-env, mocha, nodemon, babel, etc)
* Configure Webpack and Babel for ES6 (client and server)
* It has plugins for basic services (mongoDB, redis, authentication, etc)
* Set up production and development environment for Angular, React and Vue.js
* Generates configuration file for Docker and Docker-compose
* Be happy =)

### Instalation

To start using the CLI you will first need to download in NPM using the following command

```bash
$ npm i -g @dek/cli
```

### Help

```bash
$ dek [help/h/?]
```

### Create new project

```bash
$ dek init
```

or

```bash
$ npx create-dek-app
```

The CLI will ask you some questions for configuring the **package.json** and **.git**.

```
? What is the name of the project? myproject
? What is the version of the project? 1.0.0
? Directory for your project: /media/Dek/CLI/myproject
? What is the repository of this project? https://github.com/dekproject/CLI
? Do you want to use DEK skeleton? Yes
? Do you want to install components for development mode? Yes
? Do you want to install Webpack to optimize your frontend? Yes
? Select plugins for your project: mongoDB, redis
? Do you want to install some frontend framework?
```

### Install plugins/dependencies

```bash
$ dek [install/i] //Install all plugins
```

```bash
$ dek [install/i] MongoDB Redis Authentication
```

```bash
$ dek [install/i] https://github.com/dekproject/redis
```

### Update dependencies

```bash
$ dek [update/u]
```

### New plugin

```bash
$ dek new plugin
```

### New controller

```bash
$ dek new controller
```
