"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Install = undefined;

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

var _plugins = require("./plugins");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CLIPath = _path2.default.resolve(_path2.default.dirname(_fs2.default.realpathSync(__filename)), "../");
var PackageJSON = require(_path2.default.join(CLIPath, "package"));

var prompt = _inquirer2.default.createPromptModule();
_inquirer2.default.registerPrompt('fuzzypath', require('inquirer-fuzzy-path'));

var Install = exports.Install = function () {
    function Install() {
        _classCallCheck(this, Install);
    }

    _createClass(Install, [{
        key: "bootstrap",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(self, packageJSONTemplate) {
                var _this = this;

                var __this, installInterval;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                __this = this;

                                this.packageJSONTemplate = packageJSONTemplate;

                                if (!self.settings.devmode) {
                                    _context2.next = 7;
                                    break;
                                }

                                _context2.next = 5;
                                return this.installDevMode(self);

                            case 5:
                                _context2.next = 8;
                                break;

                            case 7:
                                this.installedDevMode = true;

                            case 8:
                                if (!(self.settings.frontend != "none")) {
                                    _context2.next = 14;
                                    break;
                                }

                                _context2.next = 11;
                                return this.installFrontendFramework(self);

                            case 11:
                                this.installedWebpack = true;
                                _context2.next = 17;
                                break;

                            case 14:
                                _context2.next = 16;
                                return this.installWebpack(self);

                            case 16:
                                this.installedFrontend = true;

                            case 17:
                                installInterval = setInterval(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    if (!(_this.installedDevMode && _this.installedWebpack && _this.installedFrontend)) {
                                                        _context.next = 10;
                                                        break;
                                                    }

                                                    clearInterval(installInterval);
                                                    console.log(_chalk2.default.green(_i18n2.default.__("Create package.json ...")));

                                                    if (!(self.settings.plugins.length > 0)) {
                                                        _context.next = 9;
                                                        break;
                                                    }

                                                    _context.next = 6;
                                                    return _plugins.plugins.installPlugins(self.settings.plugins, _path2.default.join(self.settings.path, "src", "plugins"));

                                                case 6:
                                                    _plugins.plugins.loadPackageDependencies(_path2.default.join(self.settings.path, "src", "plugins")).then(function (dependencies) {
                                                        __this.addPackageDependencies(dependencies, self.settings, function () {
                                                            console.log(_chalk2.default.green(_i18n2.default.__("Install plugins dependencies ...")));
                                                            __this.installDependencies(self);
                                                        });
                                                    });
                                                    _context.next = 10;
                                                    break;

                                                case 9:
                                                    _this.installDependencies(self);

                                                case 10:
                                                case "end":
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this);
                                })), 1000);

                            case 18:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function bootstrap(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return bootstrap;
        }()
    }, {
        key: "installDependencies",
        value: function installDependencies(self) {
            var _this2 = this;

            _fs2.default.writeFile(_path2.default.join(self.settings.path, "package.json"), JSON.stringify(this.packageJSONTemplate, null, 4), function () {
                var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(err) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                        while (1) {
                            switch (_context3.prev = _context3.next) {
                                case 0:
                                    prompt([{
                                        type: 'confirm',
                                        name: 'install',
                                        message: _i18n2.default.__("Would you like to install dependencies via NPM?")
                                    }]).then(function (result) {
                                        if (result.install) {
                                            var child = (0, _child_process.spawn)("npm install -D", {
                                                shell: true,
                                                env: process.env,
                                                cwd: self.settings.path,
                                                stdio: [process.stdin, process.stdout, process.stderr]
                                            });

                                            child.on('exit', function (exitCode) {
                                                var usageText = "Project created successfully!\n\nTo start the project in development mode:\n$ cd ." + self.settings.path.replace(process.cwd(), "") + "\n$ " + PackageJSON["@dek/scripts"].cliDevMode + "\n$ npm run dev\n";

                                                console.log(usageText);
                                                process.exit(0);
                                            });
                                        } else {
                                            var usageText = "Project created successfully!\n\nTo start the project in development mode:\n$ cd ." + self.settings.path.replace(process.cwd(), "") + "\n$ " + PackageJSON["@dek/scripts"].cliDevMode + "\n$ npm install --save-dev\n$ npm run dev\n";

                                            console.log(usageText);
                                            process.exit(0);
                                        }
                                    });

                                case 1:
                                case "end":
                                    return _context3.stop();
                            }
                        }
                    }, _callee3, _this2);
                }));

                return function (_x3) {
                    return _ref3.apply(this, arguments);
                };
            }());
        }
    }, {
        key: "installFrontendFramework",
        value: function installFrontendFramework(self) {
            var __self = this;
            this.installedFrontend = false;
            console.log(_chalk2.default.green(_i18n2.default.__("Install frontend framework ...")));

            if (this.directoryExists(_path2.default.join(self.settings.path, "public"))) {
                (0, _rimraf2.default)(_path2.default.join(self.settings.path, "public"), function () {
                    var child = (0, _child_process.spawn)(PackageJSON["@dek/frontend"][self.settings.frontend], {
                        shell: true,
                        env: process.env,
                        cwd: self.settings.path,
                        stdio: [process.stdin, process.stdout, process.stderr]
                    });

                    child.on('exit', function (exitCode) {
                        __self.installedFrontend = true;
                    });
                });
            } else {
                var child = (0, _child_process.spawn)(PackageJSON["@dek/frontend"][self.settings.frontend], {
                    shell: true,
                    env: process.env,
                    cwd: self.settings.path,
                    stdio: [process.stdin, process.stdout, process.stderr]
                });

                child.on('exit', function (exitCode) {
                    __self.installedFrontend = true;
                });
            }
        }
    }, {
        key: "installDevMode",
        value: function installDevMode(self) {
            var _this3 = this;

            this.installedDevMode = false;
            console.log(_chalk2.default.green(_i18n2.default.__("Install dev mode ...")));

            try {
                this.addPackageDependencies(PackageJSON["@dek/scripts"].devMode, { cwd: self.settings.path }, function () {
                    _this3.installedDevMode = true;
                });
            } catch (e) {
                console.log(_chalk2.default.red(e.message));
            }
        }
    }, {
        key: "installWebpack",
        value: function installWebpack(self) {
            var _this4 = this;

            this.installedWebpack = false;
            console.log(_chalk2.default.green(_i18n2.default.__("Install Webpack ...")));

            this.addPackageDependencies([PackageJSON["@dek/scripts"].webpack, PackageJSON["@dek/scripts"].webpackLoaders], { cwd: self.settings.path }, function () {
                var WebpackConfigTemplate = require(_path2.default.join(CLIPath, "templates", "webpack.config.js"))(self);
                _fs2.default.writeFileSync(_path2.default.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate);

                _this4.installedWebpack = true;
                return true;
            });
        }
    }, {
        key: "addPackageDependencies",
        value: function () {
            var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(scripts, settings, callback) {
                var _this5 = this;

                var totalScripts, loadedScripts;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                totalScripts = 0, loadedScripts = 0;


                                if (typeof scripts == "string") scripts = [scripts];

                                scripts.forEach(function (parScript) {
                                    if (/--save-dev/.test(parScript)) {
                                        parScript = parScript.replace("--save-dev", "");

                                        parScript.split(" ").forEach(function (dependency) {
                                            if (dependency && dependency != "") _this5.packageJSONTemplate.devDependencies[dependency] = "latest";
                                        });
                                    } else {
                                        parScript = parScript.replace("--save", "");

                                        parScript.split(" ").forEach(function (dependency) {
                                            if (dependency && dependency != "") _this5.packageJSONTemplate.dependencies[dependency] = "latest";
                                        });
                                    }
                                });

                                if (typeof callback == "function") setTimeout(function () {
                                    callback();
                                }, 1000);

                            case 4:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function addPackageDependencies(_x4, _x5, _x6) {
                return _ref4.apply(this, arguments);
            }

            return addPackageDependencies;
        }()
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
            var usageText = "\n  Usage:\n    dek install (with no args, in package dir)\n    dek install <plugin>\n    dek install <git:// url>\n  ";

            console.log(usageText);
        }
    }]);

    return Install;
}();

exports.default = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(argv) {
        var install;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        install = new Install();


                        if (argv.h) {
                            install.Help();
                        } else if (argv._.length > 1) {
                            argv._.forEach(function () {
                                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(pluginName, index) {
                                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                        while (1) {
                                            switch (_context5.prev = _context5.next) {
                                                case 0:
                                                    if (!(index != 0)) {
                                                        _context5.next = 3;
                                                        break;
                                                    }

                                                    _context5.next = 3;
                                                    return (0, _plugins.installPlugin)(pluginName);

                                                case 3:
                                                case "end":
                                                    return _context5.stop();
                                            }
                                        }
                                    }, _callee5, undefined);
                                }));

                                return function (_x8, _x9) {
                                    return _ref6.apply(this, arguments);
                                };
                            }());
                        } else {
                            install.Help();
                        }

                    case 2:
                    case "end":
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x7) {
        return _ref5.apply(this, arguments);
    };
}();
//# sourceMappingURL=install.js.map