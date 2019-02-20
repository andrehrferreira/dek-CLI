import fs from "fs";
import path from "path";
import npm from "npm";

import 'babel-polyfill';
import minimist from "minimist";
import chalk from "chalk";
import inquirer from "inquirer";
import i18n from "i18n";
import _ from "lodash";
import gitClone from "git-clone";
import rimraf from "rimraf";
import { exec, spawn } from "child_process";

import { installPlugins } from "./plugins";

const CLIPath = path.resolve(path.dirname(fs.realpathSync(__filename)), "../");
const PackageJSON = require(path.join(CLIPath, "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

export class Install{
    async bootstrap(self, packageJSONTemplate){
        this.packageJSONTemplate = packageJSONTemplate;

        if(self.settings.devmode)
            await this.installDevMode(self);
        else
            this.installedDevMode = true;

        if(self.settings.frontend != "none"){
            await this.installFrontendFramework(self);
            this.installedWebpack = true;
        }
        else {
            await this.installWebpack(self);
            this.installedFrontend = true;
        }

        var installInterval = setInterval(() => {
            if(this.installedDevMode && this.installedWebpack && this.installedFrontend){
                clearInterval(installInterval);
                console.log(chalk.green(i18n.__("Create package.json ...")));

                fs.writeFile(path.join(self.settings.path, "package.json"), JSON.stringify(this.packageJSONTemplate, null, 4), async (err) => {
                    console.log(chalk.green(i18n.__("Install dependencies ...")));

                    prompt([{
                        type: 'confirm',
                        name: 'install',
                        message: i18n.__("Would you like to install dependencies via NPM?"),
                    }]).then(result => {
                        if(result.install){
                            var child = spawn("npm install -D", {
                                shell: true,
                                env: process.env,
                                cwd: self.settings.path,
                                stdio: [process.stdin, process.stdout, process.stderr]
                            });

                            child.on('exit', function (exitCode) {
                                const usageText = `Project created successfully!

To start the project in development mode:
$ cd ${self.settings.path}
$ ${PackageJSON["@dek/scripts"].cliDevMode}
$ npm run dev

`;

                                console.log(usageText);
                            });
                        }
                        else{
                            const usageText = `Project created successfully!

To start the project in development mode:
$ cd ${self.settings.path}
$ ${PackageJSON["@dek/scripts"].cliDevMode}
$ npm install --save-dev
$ npm run dev

`;

                            console.log(usageText);
                        }
                    });
                });
            }
        }, 1000);
    }

    installFrontendFramework(self){
        var __self = this;
        this.installedFrontend = false;
        console.log(chalk.green(i18n.__("Install frontend framework ...")));

        if(this.directoryExists(path.join(self.settings.path, "public"))){
            rimraf(path.join(self.settings.path, "public"), () => {
                var child = spawn(PackageJSON["@dek/frontend"][self.settings.frontend], {
                    shell: true,
                    env: process.env,
                    cwd: self.settings.path,
                    stdio: [process.stdin, process.stdout, process.stderr]
                });

                child.on('exit', function (exitCode) {
                    __self.installedFrontend = true;
                });
            });
        }
        else{
            var child = spawn(PackageJSON["@dek/frontend"][self.settings.frontend], {
                shell: true,
                env: process.env,
                cwd: self.settings.path,
                stdio: [process.stdin, process.stdout, process.stderr]
            });

            child.on('exit', function (exitCode) {
                __self.installedFrontend = true;
            });
        }
    }

    installDevMode(self){
        this.installedDevMode = false;
        console.log(chalk.green(i18n.__("Install dev mode ...")));

        try{
            this.addPackageDependencies(PackageJSON["@dek/scripts"].devMode, { cwd: self.settings.path }, () => {
                this.installedDevMode = true;
            });
        } catch(e){
            console.log(chalk.red(e.message));
        }
    }

    installWebpack(self){
        this.installedWebpack = false;
        console.log(chalk.green(i18n.__("Install Webpack ...")));

        this.addPackageDependencies([PackageJSON["@dek/scripts"].webpack, PackageJSON["@dek/scripts"].webpackLoaders], { cwd: self.settings.path }, () => {
            var WebpackConfigTemplate = require(path.join(CLIPath, "templates", "webpack.config.js"))(self);
            fs.writeFileSync(path.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate);

            this.installedWebpack = true;
            return true;
        });
    }

    async addPackageDependencies(scripts, settings, callback){
        var totalScripts = 0, loadedScripts = 0;

        if(typeof scripts == "string")
            scripts = [scripts];

        scripts.forEach((parScript) => {
            if(/--save-dev/.test(parScript)){
                parScript = parScript.replace("--save-dev", "");

                parScript.split(" ").forEach((dependency) => {
                    if(dependency && dependency != "")
                        this.packageJSONTemplate.devDependencies[dependency] = "latest";
                });
            }
            else {
                parScript = parScript.replace("--save", "");

                parScript.split(" ").forEach((dependency) => {
                    if(dependency && dependency != "")
                        this.packageJSONTemplate.dependencies[dependency] = "latest";
                });
            }
        });

        if(typeof callback == "function")
            setInterval(() => { callback(); }, 1000);
    }

    directoryExists(filePath){
        try { return fs.statSync(filePath).isDirectory(); }
        catch (err) { return false; }
    }

    Help(){
        const usageText = `
  Usage:
    dek install (with no args, in package dir)
    dek install <plugin>
    dek install <git:// url>
  `

        console.log(usageText)
    }
}

export default async (argv) => {
    let install = new Install();

    if(argv.h){
        install.Help();
    }
    else if(argv._.length > 1){
        //Install Plugins
    }
    else{

    }
}
