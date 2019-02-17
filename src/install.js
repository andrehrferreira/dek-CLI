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
import { exec } from "child_process";

import { installPlugins } from "./plugins";

const PackageJSON = require(path.join(process.cwd(), "package"));

export class Install{
    bootstrap(self, packageJSONTemplate){
        console.log(packageJSONTemplate);
    }

    installDevMode(self){
        console.log(chalk.green(i18n.__("Install dev mode ...")));

        exec(PackageJSON["@dek/scripts"].cliDevMode, { cwd: self.settings.path }, (err, stdout, stderr) => {
            process.stdout.write(stdout + '\n');
            process.stderr.write(stderr + '\n');

            try{
                self.addPackageDependencies(PackageJSON["@dek/scripts"].devMode, { cwd: self.settings.path }, (err) => {
                    if(err) console.log(chalk.red(err));
                    else installPlugins(self.settings);
                });
            } catch(e){
                console.log(chalk.red(e.message));
                installPlugins(self.settings);
            }
        });
    }

    installWebpack(self){
        console.log(chalk.green(i18n.__("Install Webpack ...")));

        self.addPackageDependencies([PackageJSON["@dek/scripts"].webpack, PackageJSON["@dek/scripts"].webpackLoaders], { cwd: self.settings.path }, (err) => {
            var WebpackConfigTemplate = require(path.join(process.cwd(), "templates", "webpack.config.js"))(self);
            fs.writeFileSync(path.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate(self));
        });
    }

    addPackageDependencies(scripts, settings, callback){
        if(typeof scripts == "string")
            scripts = [scripts];

        scripts.forEach(() => {

        });

        //var sepScript = script.split("&&");
        //console.log();
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
