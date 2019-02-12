'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('babel-polyfill');

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
  var usageText;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          usageText = '\n  Usage:\n    dek <command>\n\n    commands can be:\n\n    init:       used to create a new project\n    install:    used to install plugins/dependencies\n    update:     used to update plugins/dependencies\n    new:        used to create new plugin or controller\n    help:       used to print the usage guide\n\n  dek <command> -h quick help on <command>\n  ';


          console.log(usageText);

        case 2:
        case 'end':
          return _context.stop();
      }
    }
  }, _callee, undefined);
}));
//# sourceMappingURL=help.js.map