"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Node_1 = require("./Node");
var fs = require('fs');
var path = require('path');
var stream = require('stream');
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File() {
        return _super.call(this) || this;
    }
    File.prototype.remove = function () {
        fs.unlinkSync(this.absoluteFilepath);
    };
    Object.defineProperty(File.prototype, "name", {
        get: function () {
            return path.basename(this.absoluteFilepath, this.extension);
        },
        set: function (value) {
            var newAbsoluteFilepath = path.join(path.dirname(this.absoluteFilepath), value + path.extname(this.absoluteFilepath));
            fs.renameSync(this.absoluteFilepath, newAbsoluteFilepath);
            this._updateCache(newAbsoluteFilepath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "fullname", {
        get: function () {
            return path.basename(this.absoluteFilepath);
        },
        set: function (value) {
            var newAbsoluteFilepath = path.join(path.dirname(this.absoluteFilepath), value);
            fs.renameSync(this.absoluteFilepath, newAbsoluteFilepath);
            this._updateCache(newAbsoluteFilepath);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(File.prototype, "extension", {
        get: function () {
            return path.extname(this.absoluteFilepath);
        },
        enumerable: true,
        configurable: true
    });
    File.prototype.read = function (options) {
        return fs.readFileSync(this.absoluteFilepath, options).toString();
    };
    File.prototype.write = function (text, options) {
        fs.writeFileSync(this.absoluteFilepath, text, options);
    };
    File.prototype.writeFromStream = function (stream) {
        stream.pipe(fs.createWriteStream(this.absoluteFilepath));
    };
    File.prototype.createReadStream = function () {
        return fs.createReadStream(this.absoluteFilepath);
    };
    return File;
}(Node_1.Node));
exports.File = File;
//# sourceMappingURL=File.js.map