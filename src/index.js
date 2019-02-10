#!/usr/bin/env node

import fs from "fs";
import path from "path";

import minimist from "minimist";
import chalk from "chalk";
import clear from "clear";
import figlet from "figlet";
import inquirer from "inquirer";
import i18n from "i18n";
import _ from "lodash";

import Init from "./init";

const PackageJSON = require(path.join(process.cwd(), "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en', 'ptBR'],
    defaultLocale: 'en',
    directory: path.join(process.cwd(), "locales")
});

class CLI {
    constructor(argv) {
        //clear();
        //console.log(chalk.red(figlet.textSync('Dek', { horizontalLayout: 'full' })));

        switch(argv._[0]){
            case "init": Init(); break;
            case "new":
            case "n":
                console.log("new");
            break;
            case "install":
            case "i":
                console.log("install");
            break;
            case "update":
            case "u":
                console.log("update");
            break;
            case "help":
            case "h":
            case "?":
                console.log("help");
            break;
            default:
                console.log(chalk.red(i18n.__("Command not found")));
            break;
        }
    }

    directoryExists(filePath){
        try {
            return fs.statSync(filePath).isDirectory();
        }
        catch (err) {
            return false;
        }
    }
}

new CLI(require('minimist')(process.argv.slice(2)));
