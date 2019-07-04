# @dekproject/CLI

CLI for Dek

What does the CLI do?

* Create a base project
* Has an optional base skeleton to facilitate the development (https://github.com/dekproject/boostrap)
* Installs development components (cross-env, nodemon, babel, etc)
* Configure Babel for ES6 (client and server)
* It has plugins for basic services (mongodb, redis, etc)
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

### Dev mode

To start the project in development mode just enter the following commands:

```bash
$ cd myproject
$ yarn dev
```

### Build

To build both the server and the frontend files, simply enter the following command

```bash
$ yarn build
```

### Production

We recommend that for production be configured using the DEK **publish** function, but if you want to perform all configuration manually, just use the following commands:

```bash
$ yarn start
```

## Plugins

### Instalation

To install plugins manually use the command:

```bash
$ dek install mongodb redis
```

### New Plugin

To create a new plugin run the following command:

```bash
$ dek new plugin
```

## Help

```bash
$ dek [help/h/?]
```
