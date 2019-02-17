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

var PackageJSON = require(_path2.default.join(process.cwd(), "package"));

var Install = exports.Install = function () {
    function Install() {
        _classCallCheck(this, Install);
    }

    _createClass(Install, [{
        key: "bootstrap",
        value: function bootstrap(self, packageJSONTemplate) {
            console.log(packageJSONTemplate);
        }
    }, {
        key: "installDevMode",
        value: function installDevMode(self) {
            console.log(_chalk2.default.green(_i18n2.default.__("Install dev mode ...")));

            (0, _child_process.exec)(PackageJSON["@dek/scripts"].cliDevMode, { cwd: self.settings.path }, function (err, stdout, stderr) {
                process.stdout.write(stdout + '\n');
                process.stderr.write(stderr + '\n');

                try {
                    self.addPackageDependencies(PackageJSON["@dek/scripts"].devMode, { cwd: self.settings.path }, function (err) {
                        if (err) console.log(_chalk2.default.red(err));else (0, _plugins.installPlugins)(self.settings);
                    });
                } catch (e) {
                    console.log(_chalk2.default.red(e.message));
                    (0, _plugins.installPlugins)(self.settings);
                }
            });
        }
    }, {
        key: "installWebpack",
        value: function installWebpack(self) {
            console.log(_chalk2.default.green(_i18n2.default.__("Install Webpack ...")));

            self.addPackageDependencies([PackageJSON["@dek/scripts"].webpack, PackageJSON["@dek/scripts"].webpackLoaders], { cwd: self.settings.path }, function (err) {
                var WebpackConfigTemplate = require(_path2.default.join(process.cwd(), "templates", "webpack.config.js"))(self);
                _fs2.default.writeFileSync(_path2.default.join(self.settings.path, "webpack.config.js"), WebpackConfigTemplate(self));
            });
        }
    }, {
        key: "addPackageDependencies",
        value: function addPackageDependencies(scripts, settings, callback) {
            if (typeof scripts == "string") scripts = [scripts];

            scripts.forEach(function () {});

            //var sepScript = script.split("&&");
            //console.log();
        }
    }, {
        key: "Help",
        value: function Help() {
            var usageText = "\n      Usage:\n        dek install (with no args, in package dir)\n        dek install <plugin>\n        dek install <git:// url>\n      ";

            console.log(usageText);
        }
    }]);

    return Install;
}();

exports.default = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(argv) {
        var install;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        install = new Install();


                        if (argv.h) {} else if (argv._.length > 1) {
                            //Install Plugins
                        } else {}

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
//# sourceMappingURL=install.js.map