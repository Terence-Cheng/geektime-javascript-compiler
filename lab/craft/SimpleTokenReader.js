"use strict";
exports.__esModule = true;
var SimpleTokenReader = /** @class */ (function () {
    function SimpleTokenReader(tokens) {
        this.tokens = null;
        this.tokens = tokens;
    }
    SimpleTokenReader.prototype.peek = function () {
        if (!this.tokens || !this.tokens.length) {
            return null;
        }
        // @ts-ignore
        return this.tokens[0];
    };
    SimpleTokenReader.prototype.read = function () {
        if (!this.tokens.length) {
            return null;
        }
        return this.tokens.shift();
    };
    return SimpleTokenReader;
}());
exports["default"] = SimpleTokenReader;
