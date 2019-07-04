"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

require("@babel/polyfill/noConflict");

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

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

var _plugins = require("./plugins");

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

var New = function () {
    function New() {
        _classCallCheck(this, New);
    }

    _createClass(New, [{
        key: "Plugin",
        value: function Plugin() {
            _plugins.plugins.new();
        }
    }, {
        key: "Controller",
        value: function Controller() {
            console.log("not implemented, sorry =(");
        }
    }]);

    return New;
}();

exports.default = new New();
//# sourceMappingURL=new.js.map