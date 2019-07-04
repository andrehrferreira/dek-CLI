#!/usr/bin/env node
"use strict";

require("@babel/polyfill/noConflict");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _clear = require("clear");

var _clear2 = _interopRequireDefault(_clear);

var _figlet = require("figlet");

var _figlet2 = _interopRequireDefault(_figlet);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _i18n = require("i18n");

var _i18n2 = _interopRequireDefault(_i18n);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _help = require("./help");

var _help2 = _interopRequireDefault(_help);

var _init = require("./init");

var _init2 = _interopRequireDefault(_init);

var _install = require("./install");

var _install2 = _interopRequireDefault(_install);

var _new = require("./new");

var _new2 = _interopRequireDefault(_new);

var _update = require("./update");

var _update2 = _interopRequireDefault(_update);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLIPath = _path2.default.resolve(_path2.default.dirname(_fs2.default.realpathSync(__filename)), "../");
var PackageJSON = require(_path2.default.join(CLIPath, "package"));

var prompt = _inquirer2.default.createPromptModule();
_inquirer2.default.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

_i18n2.default.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: _path2.default.join(CLIPath, "locales")
});

var CLI = function CLI(argv) {
    _classCallCheck(this, CLI);

    switch (argv._[0]) {
        case "init":
            (0, _init2.default)(argv);break;
        case "new":
        case "n":
            switch (argv._[1]) {
                case "plugin":
                    _new2.default.Plugin(argv);break;
                case "controller":
                    _new2.default.Controller(argv);break;
                default:
                    console.log(_chalk2.default.red(_i18n2.default.__("Command not found, use 'dek help' for more information")));
                    break;
            }
            break;
        case "install":case "i":
            (0, _install2.default)(argv);break;
        case "update":case "u":
            (0, _update2.default)(argv);break;
        case "help":case "h":case "?":
            (0, _help2.default)();break;
        default:
            console.log(_chalk2.default.red(_i18n2.default.__("Command not found, use 'dek help' for more information")));
            break;
    }
};

new CLI(require('minimist')(process.argv.slice(2)));
//# sourceMappingURL=index.js.map