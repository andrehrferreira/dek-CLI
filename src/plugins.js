import fs from "fs";
import path from "path";

import 'babel-polyfill';
import chalk from "chalk";
import globby from "globby";
import _ from "lodash";
import inquirer from "inquirer";
import i18n from "i18n";
import { spawn } from "child_process";

let prompt = inquirer.createPromptModule();

const CLIPath = path.resolve(path.dirname(fs.realpathSync(__filename)), "../");
const PackageJSON = require(path.join(CLIPath, "package"));

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(CLIPath, "locales")
});

class Plugins{
    async installPlugins(plugins, pathName){
        await plugins.forEach(async (pluginName) => {
            await this.installPlugin(pluginName, pathName);
        });
    }

    async installPlugin(pluginName, pathName){
        return new Promise((resolve, reject) => {
            if(pathName)
                var pluginPathResolve = path.resolve(pathName);
            else
                var pluginPathResolve = path.resolve(path.join(process.cwd(), "src", "plugins"));

            (async () => {
                try {
                    if(!fs.statSync(pluginPathResolve).isDirectory())
                        await fs.mkdirSync(pluginPathResolve, { recursive: true });
                }
                catch (err) {
                    fs.mkdirSync(pluginPathResolve, { recursive: true });
                }
            })();

            console.log(chalk.green(`[${pluginName}] Installing ...`));

            var child = spawn(`git clone https://github.com/dekproject/${pluginName}`, {
                shell: true,
                env: process.env,
                cwd: pluginPathResolve
            });

            child.on('error', function (err) {
                reject(`[${pluginName}] ${err}`);
            });

            child.on('exit', function (exitCode) {
                resolve();
            });
        });
    }

    loadPackageDependencies(pathName){
        return new Promise((resolve, reject) => {
            if(pathName)
                var pluginPathResolve = path.resolve(pathName);
            else
                var pluginPathResolve = path.resolve(path.join(process.cwd(), "src", "plugins"));

            setTimeout(() => {
                globby([`${pluginPathResolve}/*/package.json`]).then((paths) => {
                    var dependenciesArr = [];

                    paths.forEach((pluginPackagePath) => {
                        var pluginPackageRequest = require(pluginPackagePath);
                        dependenciesArr = _.merge(dependenciesArr, Object.keys(pluginPackageRequest.dependencies));
                    });

                    resolve(dependenciesArr.join(" "));
                });
            }, 3000);
        });
    }

    new(){
        var pluginPathResolve = path.resolve(path.join(process.cwd(), "src", "plugins"));

        (async () => {
            try {
                if(!fs.statSync(pluginPathResolve).isDirectory())
                    await fs.mkdirSync(pluginPathResolve, { recursive: true });
            }
            catch (err) {
                fs.mkdirSync(pluginPathResolve, { recursive: true });
            }
        })();

        prompt([{
            type: "input",
            name: "name",
            default: i18n.__("myplugin"),
            message: i18n.__("What is the name of the plugin?"),
            validate: (value) => {
                if (value.length)
                    return true;
                else
                    return i18n.__("Please set a valid value");
            }
        }]).then(async newPluginSettings => {
            var child = spawn(`git clone https://github.com/dekproject/plugin-bootstrap ${newPluginSettings.name}`, {
                shell: true,
                cwd: pluginPathResolve
            });

            child.on('error', function (err) {
                console.log(chalk.red(`[${newPluginSettings.name}] ${err}`));
            });

            child.on('exit', function (exitCode) {
                console.log(chalk.green(`[${newPluginSettings.name}] creating successfully!`));
            });
        });
    }
}

export let plugins = new Plugins();
export let installPlugins = new Plugins().installPlugins;
export let installPlugin = new Plugins().installPlugin;

export default async (argv) => {
    let plugins = new Plugins();

    if(argv.h){
        plugins.Help();
    }
};
