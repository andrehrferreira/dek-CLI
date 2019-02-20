#!/usr/bin/env node

import fs from "fs";
import path from "path";

import 'babel-polyfill';
import minimist from "minimist";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import i18n from "i18n";
import _ from "lodash";

import Help from "./help";
import Init from "./init";
import Install from "./install";
import New from "./new";
import Update from "./update";

const CLIPath = path.resolve(path.dirname(fs.realpathSync(__filename)), "../");
const PackageJSON = require(path.join(CLIPath, "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(CLIPath, "locales")
});

class CLI {
    constructor(argv) {
        switch(argv._[0]){
            case "init": Init(argv); break;
            case "new":
            case "n":
                switch(argv._[1]){
                    case "plugin": New.Plugin(argv); break;
                    case "controller": New.Controller(argv); break;
                    default:
                        console.log(chalk.red(i18n.__("Command not found, use 'dek help' for more information")));
                    break;
                }
            break;
            case "install": case "i": Install(argv); break;
            case "update": case "u": Update(argv); break;
            case "help": case "h": case "?": Help(); break;
            default:
                console.log(chalk.red(i18n.__("Command not found, use 'dek help' for more information")));
            break;
        }
    }
}

new CLI(require('minimist')(process.argv.slice(2)));
