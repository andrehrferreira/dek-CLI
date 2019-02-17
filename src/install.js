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
import { PluginManager } from "live-plugin-manager";

import { installPlugins } from "./plugins";

const PackageJSON = require(path.join(process.cwd(), "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

export class Install{
    async bootstrap(self, packageJSONTemplate){
        this.packageJSONTemplate = packageJSONTemplate;

        if(self.settings.devmode)
            await this.installDevMode(self);
        else
            this.installedDevMode = true;

        if(self.settings.webpack)
            await this.installWebpack(self);
        else
            this.installedWebpack = true;

        //if(self.settings.skeleton)
        //    installPlugins(self, packageJSONTemplate);

        var installInterval = setInterval(() => {
            if(this.installedDevMode && this.installedWebpack){
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
                            exec("npm install", { cwd: self.settings.path }, (err, stdout, stderr) => {
                                process.stdout.write(stdout + '\n');
                                process.stderr.write(stderr + '\n');

                                console.log(chalk.green(i18n.__("Install nodemon ...")));

                                exec(PackageJSON["@dek/scripts"].cliDevMode, { cwd: self.settings.path }, (err, stdout, stderr) => {
                                    process.stdout.write(stdout + '\n');
                                    process.stderr.write(stderr + '\n');
                                    return true;
                                });
                            });
                        }
                        else{
                            const usageText = `
    Project created successfully!

    To start the project in development mode:
    cd ${self.settings.path}
    npm i -g nodemon && npm install
    npm run dev`;

                          console.log(usageText);
                        }
                    });
                });
            }
        }, 1000);
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

        return this.addPackageDependencies([PackageJSON["@dek/scripts"].webpack, PackageJSON["@dek/scripts"].webpackLoaders], { cwd: self.settings.path }, () => {
            var WebpackConfigTemplate = require(path.join(process.cwd(), "templates", "webpack.config.js"))(self);
            fs.writeFileSync(path.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate);

            this.installedWebpack = true;
            return true;
        });
    }

    async addPackageDependencies(scripts, settings, callback){
        var totalScripts = 0, loadedScripts = 0;

        if(typeof scripts == "string")
            scripts = [scripts];

        await npm.load({}, (err) => {
            scripts.forEach((parScript) => {
                if(/--save-dev/.test(parScript)){
                    parScript = parScript.replace("--save-dev", "");

                    parScript.split(" ").forEach((dependency) => {
                        if(dependency && dependency != ""){
                            totalScripts++;

                            npm.commands.show([dependency, 'name'], (err, rawData) => {
                                loadedScripts++;
                                this.packageJSONTemplate.devDependencies[dependency] = "^" + Object.keys(rawData)[0];
                            });
                        }
                    });
                }
                else {
                    parScript = parScript.replace("--save", "");

                    parScript.split(" ").forEach((dependency) => {
                        if(dependency && dependency != ""){
                            totalScripts++;

                            npm.commands.show([dependency, 'name'], (err, rawData) => {
                                loadedScripts++;
                                this.packageJSONTemplate.dependencies[dependency] = "^" + Object.keys(rawData)[0];
                            });
                        }
                    });
                }
            });

            if(typeof callback == "function"){
                var pCallback = setInterval(() => {
                    if(loadedScripts === totalScripts){
                        callback();
                        clearInterval(pCallback);
                    }
                }, 1000);
            }
        });
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
