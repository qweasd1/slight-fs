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
var Directory_1 = require("./Directory");
var path = require('path');
var Root = /** @class */ (function (_super) {
    __extends(Root, _super);
    function Root(config) {
        var _this = _super.call(this) || this;
        _this.config = config;
        _this.nodeCache = new Map();
        // turn root to absolute filepath
        _this.absoluteFilepath = path.resolve(config.rootDir);
        _this.nodeCache.set(_this.absoluteFilepath, _this);
        _this.root = _this;
        _this.isRoot = true;
        return _this;
    }
    return Root;
}(Directory_1.Directory));
exports.Root = Root;
//# sourceMappingURL=Root.js.map