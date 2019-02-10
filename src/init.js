import fs from "fs";
import path from "path";

import i18n from "i18n";
import inquirer from "inquirer";
import _ from "lodash";

const PackageJSON = require(path.join(process.cwd(), "package"));

let prompt = inquirer.createPromptModule();
inquirer.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

i18n.configure({
    locales: ['en', 'ptBR'],
    defaultLocale: 'en',
    directory: path.join(process.cwd(), "locales")
});

export default async () => {
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
            type: 'checkbox',
            name: 'plugins',
            message: i18n.__("Select plugins for your project:"),
            choices: Object.keys(PackageJSON.dekPlugins)
        }]).then(projectSettings2 => {
            projectSettings = _.merge(projectSettings, projectSettings2);

            //Make dir
            //Clone Skeleton
            //Remove .git and package.json
            //Git Init / Add remote
            //Npm Init
            //Download Plugins
            //Install dependency
        });;
    });
}
