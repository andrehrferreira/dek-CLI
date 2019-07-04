import '@babel/polyfill/noConflict';

import fs from "fs";
import path from "path";
import minimist from "minimist";
import chalk from "chalk";
import inquirer from "inquirer";
import i18n from "i18n";
import _ from "lodash";

import { plugins } from "./plugins";

const CLIPath = path.resolve(path.dirname(fs.realpathSync(__filename)), "../");
const PackageJSON = require(path.join(CLIPath, "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: path.join(CLIPath, "locales")
});

class New {
    Plugin(){ plugins.new(); }

    Controller(){
        console.log("not implemented, sorry =(");
    }
}

export default new New();
