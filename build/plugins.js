"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.installPlugin = exports.installPlugins = exports.plugins = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

require("babel-polyfill");

var _chalk = require("chalk");

var _chalk2 = _interopRequireDefault(_chalk);

var _globby = require("globby");

var _globby2 = _interopRequireDefault(_globby);

var _lodash = require("lodash");

var _lodash2 = _interopRequireDefault(_lodash);

var _inquirer = require("inquirer");

var _inquirer2 = _interopRequireDefault(_inquirer);

var _i18n = require("i18n");

var _i18n2 = _interopRequireDefault(_i18n);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prompt = _inquirer2.default.createPromptModule();

var CLIPath = _path2.default.resolve(_path2.default.dirname(_fs2.default.realpathSync(__filename)), "../");
var PackageJSON = require(_path2.default.join(CLIPath, "package"));

_i18n2.default.configure({
    locales: ['en'],
    defaultLocale: 'en',
    directory: _path2.default.join(CLIPath, "locales")
});

var Plugins = function () {
    function Plugins() {
        _classCallCheck(this, Plugins);
    }

    _createClass(Plugins, [{
        key: "installPlugins",
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(plugins, pathName) {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return plugins.forEach(function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pluginName) {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this.installPlugin(pluginName, pathName);

                                                    case 2:
                                                    case "end":
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function (_x3) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }());

                            case 2:
                            case "end":
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function installPlugins(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return installPlugins;
        }()
    }, {
        key: "installPlugin",
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(pluginName, pathName) {
                var _this2 = this;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt("return", new Promise(function (resolve, reject) {
                                    if (pathName) var pluginPathResolve = _path2.default.resolve(pathName);else var pluginPathResolve = _path2.default.resolve(_path2.default.join(process.cwd(), "src", "plugins"));

                                    _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        _context3.prev = 0;

                                                        if (_fs2.default.statSync(pluginPathResolve).isDirectory()) {
                                                            _context3.next = 4;
                                                            break;
                                                        }

                                                        _context3.next = 4;
                                                        return _fs2.default.mkdirSync(pluginPathResolve, { recursive: true });

                                                    case 4:
                                                        _context3.next = 9;
                                                        break;

                                                    case 6:
                                                        _context3.prev = 6;
                                                        _context3.t0 = _context3["catch"](0);

                                                        _fs2.default.mkdirSync(pluginPathResolve, { recursive: true });

                                                    case 9:
                                                    case "end":
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this2, [[0, 6]]);
                                    }))();

                                    console.log(_chalk2.default.green("[" + pluginName + "] Installing ..."));

                                    var child = (0, _child_process.spawn)("git clone https://github.com/dekproject/" + pluginName, {
                                        shell: true,
                                        env: process.env,
                                        cwd: pluginPathResolve
                                    });

                                    child.on('error', function (err) {
                                        reject("[" + pluginName + "] " + err);
                                    });

                                    child.on('exit', function (exitCode) {
                                        resolve();
                                    });
                                }));

                            case 1:
                            case "end":
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function installPlugin(_x4, _x5) {
                return _ref3.apply(this, arguments);
            }

            return installPlugin;
        }()
    }, {
        key: "loadPackageDependencies",
        value: function loadPackageDependencies(pathName) {
            return new Promise(function (resolve, reject) {
                if (pathName) var pluginPathResolve = _path2.default.resolve(pathName);else var pluginPathResolve = _path2.default.resolve(_path2.default.join(process.cwd(), "src", "plugins"));

                setTimeout(function () {
                    (0, _globby2.default)([pluginPathResolve + "/*/package.json"]).then(function (paths) {
                        var dependenciesArr = [];

                        paths.forEach(function (pluginPackagePath) {
                            var pluginPackageRequest = require(pluginPackagePath);
                            dependenciesArr = _lodash2.default.merge(dependenciesArr, Object.keys(pluginPackageRequest.dependencies));
                        });

                        resolve(dependenciesArr.join(" "));
                    });
                }, 3000);
            });
        }
    }, {
        key: "new",
        value: function _new() {
            var _this3 = this;

            var pluginPathResolve = _path2.default.resolve(_path2.default.join(process.cwd(), "src", "plugins"));

            _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.prev = 0;

                                if (_fs2.default.statSync(pluginPathResolve).isDirectory()) {
                                    _context5.next = 4;
                                    break;
                                }

                                _context5.next = 4;
                                return _fs2.default.mkdirSync(pluginPathResolve, { recursive: true });

                            case 4:
                                _context5.next = 9;
                                break;

                            case 6:
                                _context5.prev = 6;
                                _context5.t0 = _context5["catch"](0);

                                _fs2.default.mkdirSync(pluginPathResolve, { recursive: true });

                            case 9:
                            case "end":
                                return _context5.stop();
                        }
                    }
                }, _callee5, _this3, [[0, 6]]);
            }))();

            prompt([{
                type: "input",
                name: "name",
                default: _i18n2.default.__("myplugin"),
                message: _i18n2.default.__("What is the name of the plugin?"),
                validate: function validate(value) {
                    if (value.length) return true;else return _i18n2.default.__("Please set a valid value");
                }
            }]).then(function () {
                var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(newPluginSettings) {
                    var child;
                    return regeneratorRuntime.wrap(function _callee6$(_context6) {
                        while (1) {
                            switch (_context6.prev = _context6.next) {
                                case 0:
                                    child = (0, _child_process.spawn)("git clone https://github.com/dekproject/plugin-bootstrap " + newPluginSettings.name, {
                                        shell: true,
                                        cwd: pluginPathResolve
                                    });


                                    child.on('error', function (err) {
                                        console.log(_chalk2.default.red("[" + newPluginSettings.name + "] " + err));
                                    });

                                    child.on('exit', function (exitCode) {
                                        console.log(_chalk2.default.green("[" + newPluginSettings.name + "] creating successfully!"));
                                    });

                                case 3:
                                case "end":
                                    return _context6.stop();
                            }
                        }
                    }, _callee6, _this3);
                }));

                return function (_x6) {
                    return _ref6.apply(this, arguments);
                };
            }());
        }
    }]);

    return Plugins;
}();

var plugins = exports.plugins = new Plugins();
var installPlugins = exports.installPlugins = new Plugins().installPlugins;
var installPlugin = exports.installPlugin = new Plugins().installPlugin;

exports.default = function () {
    var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(argv) {
        var plugins;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        plugins = new Plugins();


                        if (argv.h) {
                            plugins.Help();
                        }

                    case 2:
                    case "end":
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x7) {
        return _ref7.apply(this, arguments);
    };
}();
//# sourceMappingURL=plugins.js.map