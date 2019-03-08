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
        await plugins.forEach((pluginName) => {
            this.installPlugin(pluginName, pathName, true);
        });
    }

    async installPlugin(pluginName, pathName, isInit){
        var __this = this;

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

            if(/(?:git|ssh|https?|git@[-\w.]+):(\/\/)?(.*?)(\.git)(\/?|\#[-\d\w._]+?)$/.test(pluginName))
                var urlRepository = pluginName;
            else
                var urlRepository = `git clone https://github.com/dekproject/${pluginName}`;

            console.log(chalk.green(`[Installing] ${urlRepository}`));

            var child = spawn(urlRepository, {
                shell: true,
                env: process.env,
                cwd: pluginPathResolve
            });

            child.on('error', (err) => {
                reject(`[${pluginName}] ${err}`);
            });

            child.on('exit', async (exitCode) => {
                if(!isInit){
                    var dependencies = await __this.loadPackageDependencies(pluginPathResolve);
                    console.log(chalk.green(`[${pluginName}] Load dependencies...`));

                    var childDependencies = spawn(`npm i ${dependencies}`, {
                        shell: true,
                        env: process.env,
                        cwd: path.resolve(path.join(process.cwd())),
                        stdio: [process.stdin, process.stdout, process.stderr]
                    });

                    childDependencies.on('error', (err) => {
                        reject(`[${pluginName}] ${err}`);
                    });

                    childDependencies.on('exit', (exitCode) => {
                        console.log(chalk.green(`[${pluginName}] Installation completed!`));
                        resolve();
                    });
                }
                else{
                    resolve();
                }
            });
        });
    }

    loadPackageDependencies(pathName, pluginList){
        return new Promise((resolve, reject) => {
            if(pathName)
                var pluginPathResolve = path.resolve(pathName);
            else
                var pluginPathResolve = path.resolve(path.join(process.cwd(), "src", "plugins"));

            if(!pluginList)
                pluginList = [];

            var pInterval = setInterval(() => {
                globby([`${pluginPathResolve}/*/package.json`]).then(async (paths) => {
                    if(paths.length == pluginList.length || pluginList.length == 0){
                        clearInterval(pInterval);
                        var dependenciesArr = [];

                        await paths.forEach(async (pluginPackagePath) => {
                            let pluginPackageRequest = await require(pluginPackagePath);
                            dependenciesArr = _.concat(dependenciesArr, Object.keys(pluginPackageRequest.dependencies));
                        });

                        setTimeout(() => {
                            resolve(dependenciesArr.join(" "));
                        }, 1000);
                    }
                });
            }, 1000);
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
