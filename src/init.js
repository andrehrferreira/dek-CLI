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
//import YAML from 'yaml';

import { Install } from "./install";

const CLIPath = path.resolve(path.dirname(fs.realpathSync(__filename)), "../");
const PackageJSON = require(path.join(CLIPath, "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(CLIPath, "locales")
});

export class Init{
    Prompt(){
        var self = this;

        prompt([
            /*{
                type: "list",
                name: "lang",
                choices: ["en", "ptBR"],
                message: "What is your language?",
                validate: (value) => {
                    i18n.setLocale(value);
                    true;
                }
            },*/
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
            }, {
                type: "input",
                name: "author",
                message: i18n.__("What is the author's name?")
            }, {
                type: "input",
                name: "description",
                default: i18n.__("Another DEK project"),
                message: i18n.__("What is the project description?")
            }, {
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
            var frontendChoices = Object.keys(PackageJSON["@dek/frontend"]);
            frontendChoices.unshift("none");

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
                validate: (value) => {
                    if(value !== ""){
                        if (/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(value))
                            return true;
                        else
                            return i18n.__("Please set a valid repository url");
                    }
                    else{
                        return true;
                    }
                }
            }, {
                type: 'confirm',
                name: 'skeleton',
                message: i18n.__("Do you want to use default skeleton?"),
            }, {
                type: 'confirm',
                name: 'devmode',
                message: i18n.__("Do you want to install components for development mode?"),
            }/*, {
                type: 'confirm',
                name: 'webpack',
                message: i18n.__("Do you want to install Webpack to optimize your frontend?"),
            }*/, {
                type: 'list',
                name: 'frontend',
                message: i18n.__("Do you want to install some frontend framework?"),
                choices: frontendChoices
            }]).then(projectConfirms => {
                if(projectConfirms.skeleton){
                    prompt([{
                        type: 'input',
                        name: 'port',
                        message: i18n.__("Define which port will be the backend:"),
                        default: "5555",
                        validate: (value) => {
                            try{
                                var iValue = parseInt(value);

                                if(iValue >= 1 && iValue <= 65535)
                                    return true;
                                else
                                    return i18n.__("Please enter a valid port between 1-65535");
                            }
                            catch(e){
                                return i18n.__("Please enter a valid port between 1-65535");
                            }
                        }
                    }, {
                        type: 'checkbox',
                        name: 'plugins',
                        message: i18n.__("Select plugins for your project:"),
                        choices: Object.keys(PackageJSON["@dek/plugins"])
                    }]).then(projectSettingsPlugins => {
                        if(projectConfirms.frontend != "none"){
                            prompt([{
                                type: 'confirm',
                                name: 'frontendproxy',
                                message: i18n.__("Do you want to create a frontend proxy?"),
                            }, {
                                type: 'input',
                                name: 'backendroute',
                                default: "/api",
                                message: i18n.__("What will be the backend path?"),
                            }]).then(projectFrontendSettings => {
                                let settings = _.merge(projectSettings, projectConfirms, projectSettingsPlugins, projectFrontendSettings);
                                self.settings = settings;
                                self.createProject();
                            });
                        }
                        else{
                            let settings = _.merge(projectSettings, projectConfirms, projectSettingsPlugins);
                            self.settings = settings;
                            self.createProject();
                        }
                    });
                }
                else{
                    settings = _.merge(projectSettings, projectConfirms);
                    self.settings = settings;
                    self.createProject();
                }
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

        if(self.settings.skeleton){
            var child = spawn(`git clone https://github.com/dekproject/boostrap ${self.settings.path}`, {
                shell: true,
                env: process.env,
                cwd: self.settings.path
            });

            child.on('exit', function (exitCode) {
                self.unlinkGitAndPackage(self);
            });

            /*gitClone("git@github.com:dekproject/boostrap.git", self.settings.path, err => {
                if(err) console.log(chalk.red(err));
                else {
                    self.unlinkGitAndPackage(self);
                }
            });*/
        }
        else{
            self.createGitAndPackage(self);
        }
    }

    unlinkGitAndPackage(self){
        try{
            console.log(chalk.green(i18n.__("Unlink boostrap package.json")));
            fs.unlinkSync(path.join(self.settings.path, "package.json"));
        } catch(e) { /*console.log(chalk.red(e.message));*/ }

        console.log(chalk.green(i18n.__("Unlink boostrap " + path.join(self.settings.path, ".git"))));

        //Remove .git
        rimraf(path.join(self.settings.path, ".git"), () => {
            self.createGitAndPackage(self);
        });

        //Create .env
        var dotEnvFile = `DEBUG=true\nPORT=${self.settings.port}\n`;

        if(self.settings.frontend != "none" && self.settings.frontendproxy){
            switch (self.settings.frontend) {
                case "nuxt":
                case "react":
                    dotEnvFile += "PROXY_URL=http://localhost:3000\n";
                break;
                case "angular": dotEnvFile += "PROXY_URL=http://localhost:4200\n"; break;
                default:
                    console.log(chalk.red(i18n.__("Error trying to create proxy")));
                break;
            }

            if(self.settings.backendroute)
                dotEnvFile += `BACKEND_ALIAS=${self.settings.backendroute}\n`;

            //Create proxy.js
            fs.writeFileSync(path.join(self.settings.path, "src", "proxy.js"), require(path.join(CLIPath, "templates", "proxy.js"))());
        }

        fs.writeFileSync(path.join(self.settings.path, ".env"), dotEnvFile);
    }

    createGitAndPackage(self){
        console.log(chalk.green(i18n.__("Creating project package.json ...")));

        if(self.settings.frontend && self.settings.frontend != "none")
            var packageJSONTemplate = require(path.join(CLIPath, "templates", "package-with-frontend.json.js"));
        else
            var packageJSONTemplate = require(path.join(CLIPath, "templates", "package.json.js"));

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

        if(self.settings.repository != ""){
            console.log(chalk.green(i18n.__("Creating project .git ...")));

            exec("git init", { cwd: self.settings.path }, (err, stdout, stderr) => {
                if(err) console.log(chalk.red(err));
                else{
                    exec("git remote add origin " + self.settings.repository, { cwd: self.settings.path }, (err, stdout, stderr) => {
                        if(err) console.log(chalk.red(err));
                        else{
                            new Install().bootstrap(self, packageJSONTemplate);
                        }
                    });
                }
            });
        }
        else{
            new Install().bootstrap(self, packageJSONTemplate);
        }
    }

    directoryExists(filePath){
        try { return fs.statSync(filePath).isDirectory(); }
        catch (err) { return false; }
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
