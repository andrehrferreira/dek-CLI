import fs from "fs";
import path from "path";

import 'babel-polyfill';
import minimist from "minimist";
import chalk from "chalk";
import inquirer from "inquirer";
import i18n from "i18n";
import _ from "lodash";
import gitClone from "git-clone";
import rimraf from "rimraf";
import { exec } from "child_process";

import { installPlugins } from "./plugins";
import Install from "./install";

const PackageJSON = require(path.join(process.cwd(), "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en', 'ptBR'],
    defaultLocale: 'en',
    directory: path.join(process.cwd(), "locales")
});

export class Init{
    Prompt(){
        prompt([
            {
                type: "list",
                name: "lang",
                choices: ["en", "ptBR"],
                message: "What is your language?",
                validate: (value) => {
                    i18n.setLocale(value);
                    true;
                }
            },
            {
                type: "input",
                name: "name",
                default: i18n.__("myproject"),
                message: i18n.__("What is the name of the project?"),
                validate: (value) => {
                    if (value.length)
                        return true;
                    else
                        return i18n.__("Please set a valid value");
                }
            },
            {
                type: "input",
                name: "version",
                default: "1.0.0",
                message: i18n.__("What is the version of the project?"),
                validate: (value) => {
                    if (value.length)
                        return true;
                    else
                        return i18n.__("Please set a valid value");
                }
            },
        ]).then(projectSettings => {
            prompt([{
                type: 'input',
                name: 'path',
                itemType: 'directory',
                rootPath: process.cwd(),
                message: i18n.__("Directory for your project:",),
                default: process.cwd() + "/" + projectSettings.name,
                suggestOnly: true
            }, {
                type: 'input',
                name: 'repository',
                message: i18n.__("What is the repository of this project?"),
            }, {
                type: 'confirm',
                name: 'devmode',
                message: i18n.__("Do you want to install components for development mode?"),
            }, {
                type: 'confirm',
                name: 'webpack',
                message: i18n.__("Do you want to install Webpack to optimize your frontend?"),
            }, {
                type: 'checkbox',
                name: 'plugins',
                message: i18n.__("Select plugins for your project:"),
                choices: Object.keys(PackageJSON["@dek/plugins"])
            }]).then(projectSettings2 => {
                projectSettings = _.merge(projectSettings, projectSettings2);
                this.settings = projectSettings;
                this.createProject();
            });;
        });
    }

    createProject(){
        var self = this;

        if(!this.directoryExists(self.settings.path)){
            console.log(chalk.green(i18n.__("Creating directory ") + self.settings.path));

            fs.mkdir(self.settings.path, { recursive: true }, (err) => {
                if(err) reject(err);
                else self.cloneSkeleton(self);
            });
        }
        else{
            console.log(chalk.red((i18n.__("It was not possible to create the project because the directory already exists"))));
        }
    }

    cloneSkeleton(self){
        console.log(chalk.green(i18n.__("Clone boorstrap ") + PackageJSON.repository.url.replace("CLI", "boostrap")));

        gitClone(PackageJSON.repository.url.replace("CLI", "boostrap"), self.settings.path, err => {
            if(err) reject(chalk.red(err));
            else self.unlinkGitAndPackage(self);
        });
    }

    unlinkGitAndPackage(self){
        try{
            console.log(chalk.green(i18n.__("Unlink package.json")));
            fs.unlinkSync(path.join(self.settings.path, "package.json"));
        } catch(e) { /*console.log(chalk.red(e.message));*/ }

        console.log(chalk.green(i18n.__("Unlink " + path.join(self.settings.path, ".git"))));

        rimraf(path.join(self.settings.path, ".git"), () => {
            self.createGitAndPackage(self);
        });
    }

    createGitAndPackage(self){
        console.log(chalk.green(i18n.__("Creating package.json ...")));

        console.log(path.join(process.cwd(), "templates", "package.json.js"));
        var packageJSONTemplate = require(path.join(process.cwd(), "templates", "package.json.js"));
        console.log(packageJSONTemplate);
        packageJSONTemplate = packageJSONTemplate(self);

        if(self.settings.repository != ""){
            packageJSONTemplate.homepage = self.settings.repository;

            packageJSONTemplate.repository = {
                "type": "git",
                "url": self.settings.repository
            };

            packageJSONTemplate.bugs = {
                "url": self.settings.repository + "/issues"
            }
        }

        console.log(packageJSONTemplate);

        if(this.settings.webpack)
            packageJSONTemplate.scripts.build += " && webpack --mode production --progress";

        fs.writeFileSync(path.join(self.settings.path, "package.json"), JSON.stringify(packageJSONTemplate, null, 4));

        if(self.settings.repository != ""){
            console.log(chalk.green(i18n.__("Creating .git ...")));

            exec("git init", { cwd: self.settings.path }, (err, stdout, stderr) => {
                process.stdout.write(stdout + '\n');
                process.stderr.write(stderr + '\n');

                if(err) console.log(chalk.red(err));
                else if(stderr) console.log(chalk.red(stderr));
                else{
                    exec("git remote add origin " + self.settings.repository, { cwd: self.settings.path }, (err, stdout, stderr) => {
                        process.stdout.write(stdout + '\n');
                        process.stderr.write(stderr + '\n');

                        if(err) console.log(chalk.red(err));
                        else if(stderr) console.log(chalk.red(stderr));
                        else{
                            if(this.settings.devmode)
                                self.installDevMode(self);
                            else
                                installPlugins(self.settings);

                            if(this.settings.webpack)
                                self.installWebpack(self);
                        }
                    });
                }
            });
        }
        else{
            if(this.settings.devmode)
                self.installDevMode(self);
            else
                installPlugins(self.settings);

            if(this.settings.webpack)
                self.installWebpack(self);
        }
    }

    installDevMode(self){
        console.log(chalk.green(i18n.__("Install dev mode ...")));

        exec(PackageJSON["@dek/scripts"].cliDevMode, { cwd: self.settings.path }, (err, stdout, stderr) => {
            process.stdout.write(stdout + '\n');
            process.stderr.write(stderr + '\n');
        });

        try{
            exec(PackageJSON["@dek/scripts"].devMode, { cwd: self.settings.path }, (err, stdout, stderr) => {
                process.stdout.write(stdout + '\n');
                process.stderr.write(stderr + '\n');

                if(err) console.log(chalk.red(err));
                else if(stderr) console.log(chalk.red(stderr));
                else {
                    installPlugins(self.settings);
                }
            });
        } catch(e){
            console.log(chalk.red(e.message));
            installPlugins(self.settings);
        }
    }

    installWebpack(self){
        console.log(chalk.green(i18n.__("Install Webpack ...")));

        exec(PackageJSON["@dek/scripts"].webpack, { cwd: self.settings.path }, (err, stdout, stderr) => {
            process.stdout.write(stdout + '\n');
            process.stderr.write(stderr + '\n');

            var WebpackConfigTemplate = require(path.join(process.cwd(), "templates", "webpack.config.js"))(self);
            fs.writeFileSync(path.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate(self));
        });
    }

    directoryExists(filePath){
        try {
            return fs.statSync(filePath).isDirectory();
        }
        catch (err) {
            return false;
        }
    }

    Help(){
        console.log(chalk.yellow("Very simple 'dek init' only"));
    }
}

export default async (argv) => {
    let init = new Init();

    if(argv.h)
        init.Help();
    else
        init.Prompt();
}
