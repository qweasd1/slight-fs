"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Directory_1 = require("./Directory");
var fs = require('fs');
var path = require('path');
var Ancestor = /** @class */ (function () {
    function Ancestor(node) {
        this.node = node;
    }
    Ancestor.prototype.match = function (predicate) {
        var parent = this.node.parent;
        var isSuccess = false;
        while (true) {
            isSuccess = predicate(parent);
            if (isSuccess) {
                break;
            }
            else {
                if (parent.isRoot) {
                    break;
                }
                else {
                    parent = parent.parent;
                }
            }
        }
        if (isSuccess) {
            return parent;
        }
        else {
            return null;
        }
    };
    Ancestor.prototype.has = function (pattern, options) {
        var predicate = function (node) {
            return node.has(pattern, options);
        };
        return this.match(predicate);
    };
    Ancestor.prototype.nameMatch = function (pattern) {
        var predicate;
        if (pattern instanceof RegExp) {
            predicate = function (node) {
                return !!pattern.exec(node.name);
            };
        }
        else {
            predicate = function (node) {
                return node.name === pattern;
            };
        }
        return this.match(predicate);
    };
    return Ancestor;
}());
exports.Ancestor = Ancestor;
var Node = /** @class */ (function () {
    function Node() {
        this.isRoot = false;
    }
    Object.defineProperty(Node.prototype, "relativeFilepath", {
        get: function () {
            return path.relative(this.root.absoluteFilepath, this.absoluteFilepath);
        },
        enumerable: true,
        configurable: true
    });
    Node.prototype.exists = function () {
        return fs.existsSync(this.absoluteFilepath);
    };
    // calculate relative path to given node
    Node.prototype.relativepathTo = function (node, hasPrefix) {
        if (hasPrefix === void 0) { hasPrefix = false; }
        var originResult = path.relative(node.absoluteFilepath, this.absoluteFilepath);
        var prefix = hasPrefix ? "./" : "";
        if (originResult[0] == ".") {
            return originResult;
        }
        else {
            return prefix + originResult;
        }
    };
    Node.prototype.moveTo = function (newParent) {
        if (newParent instanceof Directory_1.Directory) {
            var newAbsoluteFilepath = path.join(newParent.absoluteFilepath, path.basename(this.absoluteFilepath));
            fs.renameSync(this.absoluteFilepath, newAbsoluteFilepath);
            this._updateCache(newAbsoluteFilepath);
            this.absoluteFilepath = newAbsoluteFilepath;
        }
    };
    // helper methods
    Node.prototype._updateCache = function (newAbsoluteFilepath) {
        this.root.nodeCache.delete(this.absoluteFilepath);
        this.absoluteFilepath = newAbsoluteFilepath;
        this.root.nodeCache.set(newAbsoluteFilepath, this);
    };
    return Node;
}());
exports.Node = Node;
//# sourceMappingURL=Node.js.map