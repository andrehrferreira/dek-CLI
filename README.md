# @dek/CLI

CLI for Dek

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

The CLI will ask you some questions for configuring the **package.json** and **.git**.

```
? What is your language? en
? What is the name of the project? myproject
? What is the version of the project? 1.0.0
? Directory for your project: /root/myproject
? What is the repository of this project?
? Select plugins for your project: Express, MongoDB
```

### Install plugins/dependencies

```bash
$ dek [install/i] //Install all plugins
```

```bash
$ dek [install/i] Express MongoDB Authentication
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
