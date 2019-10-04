"use strict";
exports.__esModule = true;
var TokenType_ts_1 = require("./TokenType_ts");
var SimpleToken = /** @class */ (function () {
    function SimpleToken() {
        this.type = null;
        this.text = null;
        this.type = null;
        this.text = null;
    }
    SimpleToken.prototype.getType = function () {
        return this.type;
    };
    SimpleToken.prototype.getText = function () {
        return this.text;
    };
    SimpleToken.prototype.getTypeValue = function () {
        // @ts-ignore
        return TokenType_ts_1["default"][this.type];
    };
    return SimpleToken;
}());
exports["default"] = SimpleToken;
