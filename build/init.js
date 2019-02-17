"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Init = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _npm = require("npm");

var _npm2 = _interopRequireDefault(_npm);

require("babel-polyfill");

var _minimist = require("minimist");

var _minimist2 = _interopRequireDefault(_minimist);

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _i18n = require("i18n");

var _i18n2 = _interopRequireDefault(_i18n);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _gitClone = require("git-clone");

var _gitClone2 = _interopRequireDefault(_gitClone);

var _rimraf = require("rimraf");

var _rimraf2 = _interopRequireDefault(_rimraf);

var _child_process = require("child_process");

var _yaml = require("yaml");

var _yaml2 = _interopRequireDefault(_yaml);

var _install = require("./install");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PackageJSON = require(_path2.default.join(process.cwd(), "package"));

var prompt = _inquirer2.default.createPromptModule();
_inquirer2.default.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

_i18n2.default.configure({
    locales: ['en', 'ptBR'],
    defaultLocale: 'en',
    directory: _path2.default.join(process.cwd(), "locales")
});

var Init = exports.Init = function () {
    function Init() {
        _classCallCheck(this, Init);
    }

    _createClass(Init, [{
        key: "Prompt",
        value: function Prompt() {
            var _this = this;

            prompt([{
                type: "list",
                name: "lang",
                choices: ["en", "ptBR"],
                message: "What is your language?",
                validate: function validate(value) {
                    _i18n2.default.setLocale(value);
                    true;
                }
            }, {
                type: "input",
                name: "name",
                default: _i18n2.default.__("myproject"),
                message: _i18n2.default.__("What is the name of the project?"),
                validate: function validate(value) {
                    if (value.length) return true;else return _i18n2.default.__("Please set a valid value");
                }
            }, {
                type: "input",
                name: "version",
                default: "1.0.0",
                message: _i18n2.default.__("What is the version of the project?"),
                validate: function validate(value) {
                    if (value.length) return true;else return _i18n2.default.__("Please set a valid value");
                }
            }]).then(function (projectSettings) {
                prompt([{
                    type: 'input',
                    name: 'path',
                    itemType: 'directory',
                    rootPath: process.cwd(),
                    message: _i18n2.default.__("Directory for your project:"),
                    default: process.cwd() + "/" + projectSettings.name,
                    suggestOnly: true
                }, {
                    type: 'input',
                    name: 'repository',
                    message: _i18n2.default.__("What is the repository of this project?")
                }, {
                    type: 'confirm',
                    name: 'devmode',
                    message: _i18n2.default.__("Do you want to install components for development mode?")
                }, {
                    type: 'confirm',
                    name: 'webpack',
                    message: _i18n2.default.__("Do you want to install Webpack to optimize your frontend?")
                }, {
                    type: 'checkbox',
                    name: 'plugins',
                    message: _i18n2.default.__("Select plugins for your project:"),
                    choices: Object.keys(PackageJSON["@dek/plugins"])
                }, {
                    type: 'list',
                    name: 'frontend',
                    message: _i18n2.default.__("Do you want to install some frontend framework?"),
                    choices: ["None", "Angular 7", "React", "Vue.js"]
                }]).then(function (projectSettings2) {
                    projectSettings = _lodash2.default.merge(projectSettings, projectSettings2);
                    _this.settings = projectSettings;
                    _this.createProject();
                });;
            });
        }
    }, {
        key: "createProject",
        value: function createProject() {
            var self = this;

            if (!this.directoryExists(self.settings.path)) {
                console.log(_chalk2.default.green(_i18n2.default.__("Creating directory ") + self.settings.path));

                _fs2.default.mkdir(self.settings.path, { recursive: true }, function (err) {
                    if (err) reject(err);else self.cloneSkeleton(self);
                });
            } else {
                console.log(_chalk2.default.red(_i18n2.default.__("It was not possible to create the project because the directory already exists")));
            }
        }
    }, {
        key: "cloneSkeleton",
        value: function cloneSkeleton(self) {
            console.log(_chalk2.default.green(_i18n2.default.__("Clone boorstrap ") + PackageJSON.repository.url.replace("CLI", "boostrap")));

            (0, _gitClone2.default)(PackageJSON.repository.url.replace("CLI", "boostrap"), self.settings.path, function (err) {
                if (err) reject(_chalk2.default.red(err));else self.unlinkGitAndPackage(self);
            });
        }
    }, {
        key: "unlinkGitAndPackage",
        value: function unlinkGitAndPackage(self) {
            _fs2.default.writeFileSync(_path2.default.join(self.settings.path, "dek.yaml"), _yaml2.default.stringify(self.settings));

            try {
                console.log(_chalk2.default.green(_i18n2.default.__("Unlink boostrap package.json")));
                _fs2.default.unlinkSync(_path2.default.join(self.settings.path, "package.json"));
            } catch (e) {/*console.log(chalk.red(e.message));*/}

            console.log(_chalk2.default.green(_i18n2.default.__("Unlink boostrap " + _path2.default.join(self.settings.path, ".git"))));

            (0, _rimraf2.default)(_path2.default.join(self.settings.path, ".git"), function () {
                self.createGitAndPackage(self);
            });
        }
    }, {
        key: "createGitAndPackage",
        value: function createGitAndPackage(self) {
            console.log(_chalk2.default.green(_i18n2.default.__("Creating project package.json ...")));

            console.log(_path2.default.join(process.cwd(), "templates", "package.json.js"));
            var packageJSONTemplate = require(_path2.default.join(process.cwd(), "templates", "package.json.js"));
            console.log(packageJSONTemplate);
            packageJSONTemplate = packageJSONTemplate(self);

            if (self.settings.repository != "") {
                packageJSONTemplate.homepage = self.settings.repository;

                packageJSONTemplate.repository = {
                    "type": "git",
                    "url": self.settings.repository
                };

                packageJSONTemplate.bugs = {
                    "url": self.settings.repository + "/issues"
                };
            }

            if (this.settings.webpack) {
                packageJSONTemplate.scripts.dev += " && webpack-dev-server";
                packageJSONTemplate.scripts.build += " && cross-env NODE_ENV=production webpack --config webpack.config.js";
            }

            _fs2.default.writeFileSync(_path2.default.join(self.settings.path, "package.json"), JSON.stringify(packageJSONTemplate, null, 4));

            if (self.settings.repository != "") {
                console.log(_chalk2.default.green(_i18n2.default.__("Creating project .git ...")));

                (0, _child_process.exec)("git init", { cwd: self.settings.path }, function (err, stdout, stderr) {
                    process.stdout.write(stdout + '\n');
                    process.stderr.write(stderr + '\n');

                    if (err) console.log(_chalk2.default.red(err));else {
                        (0, _child_process.exec)("git remote add origin " + self.settings.repository, { cwd: self.settings.path }, function (err, stdout, stderr) {
                            process.stdout.write(stdout + '\n');
                            process.stderr.write(stderr + '\n');

                            if (err) console.log(_chalk2.default.red(err));else {
                                new _install.Install().bootstrap(self, packageJSONTemplate);
                            }
                        });
                    }
                });
            } else {
                new _install.Install().bootstrap(self, packageJSONTemplate);
            }
        }
    }, {
        key: "directoryExists",
        value: function directoryExists(filePath) {
            try {
                return _fs2.default.statSync(filePath).isDirectory();
            } catch (err) {
                return false;
            }
        }
    }, {
        key: "Help",
        value: function Help() {
            console.log(_chalk2.default.yellow("Very simple 'dek init' only"));
        }
    }]);

    return Init;
}();

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {
        var init;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        init = new Init();


                        if (argv.h) init.Help();else init.Prompt();

                    case 2:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}();
//# sourceMappingURL=init.js.map