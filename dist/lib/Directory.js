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
var File_1 = require("./File");
var mkdirp = require('mkdirp').sync;
var fs = require('fs');
var path = require('path');
var glob = require('glob').sync;
var Directory = /** @class */ (function (_super) {
    __extends(Directory, _super);
    function Directory() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Directory.prototype, "name", {
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
    Directory.prototype.find = function (patten, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        return this._glob(patten, options).map(function (x) {
            return _this.get(x);
        });
    };
    Directory.prototype.get = function (relativePath) {
        var isDirectory = relativePath.charAt(relativePath.length - 1) === "/";
        var fileAbsolutePath = path.resolve(this.absoluteFilepath, relativePath);
        if (fs.existsSync(fileAbsolutePath)) {
            if (this.root.nodeCache.has(fileAbsolutePath)) {
                return this.root.nodeCache.get(fileAbsolutePath);
            }
            else {
                if (isDirectory) {
                    var parent_1 = this._recursiveCreateParent(fileAbsolutePath);
                    var directory = this._createDirectory(fileAbsolutePath);
                    directory.parent = parent_1;
                    return directory;
                }
                else {
                    var parent_2 = this._recursiveCreateParent(fileAbsolutePath);
                    var file = this._createFile(fileAbsolutePath, false);
                    file.parent = parent_2;
                    return file;
                }
            }
        }
        else {
            if (isDirectory) {
                mkdirp(fileAbsolutePath);
                var parent_3 = this._recursiveCreateParent(fileAbsolutePath);
                var directory = this._createDirectory(fileAbsolutePath);
                directory.parent = parent_3;
                return directory;
            }
            else {
                var parentPath = path.dirname(fileAbsolutePath);
                mkdirp(parentPath);
                var parent_4 = this._recursiveCreateParent(fileAbsolutePath);
                var file = this._createFile(fileAbsolutePath, true);
                file.parent = parent_4;
                return file;
            }
        }
    };
    Directory.prototype.has = function (globPattern, options) {
        if (options === void 0) { options = {}; }
        if (this._glob(globPattern, options).length > 0) {
            return true;
        }
        else {
            return false;
        }
    };
    Directory.prototype.bunlde = function (bundleObj) {
        _recursiveCreateFile(this.absoluteFilepath, bundleObj);
    };
    Directory.prototype.remove = function () {
        _removeDirectoryRecursive(this.absoluteFilepath);
    };
    Directory.prototype._glob = function (pattern, options) {
        options.cwd = this.absoluteFilepath;
        return glob(pattern, options);
    };
    // helpers
    Directory.prototype._recursiveCreateParent = function (filePath) {
        var parentPath = path.dirname(filePath);
        var parents = [];
        while (!this.root.nodeCache.has(parentPath)) {
            parents.push(this._createDirectory(parentPath));
            parentPath = path.dirname(parentPath);
        }
        parents.push(this.root.nodeCache.get(parentPath));
        for (var i = 0; i < parents.length - 1; i++) {
            parents[i].parent = parents[i + 1];
        }
        return parents[0];
    };
    Directory.prototype._createDirectory = function (absolutePath) {
        var directory = new Directory();
        directory.absoluteFilepath = absolutePath;
        directory.root = this.root;
        directory.ancestor = new Node_1.Ancestor(directory);
        this.root.nodeCache.set(absolutePath, directory);
        return directory;
    };
    Directory.prototype._createFile = function (absolutePath, createFileOnDisk) {
        if (createFileOnDisk === void 0) { createFileOnDisk = false; }
        var file = new File_1.File();
        file.absoluteFilepath = absolutePath;
        file.root = this.root;
        file.ancestor = new Node_1.Ancestor(file);
        this.root.nodeCache.set(absolutePath, file);
        if (createFileOnDisk) {
            file.write("");
        }
        return file;
    };
    return Directory;
}(Node_1.Node));
exports.Directory = Directory;
function _removeDirectoryRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) {
                _removeDirectoryRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
;
function _recursiveCreateFile(root, bundleObj) {
    Object.keys(bundleObj).forEach(function (key) {
        var value = bundleObj[key];
        var subpath = path.join(root, key);
        if (value instanceof fs.ReadStream) {
            value.pipe(fs.createWriteStream(subpath));
        }
        else if (typeof value === "string") {
            fs.writeFileSync(subpath, value);
        }
        else {
            if (!fs.existsSync(subpath)) {
                fs.mkdirSync(subpath);
            }
            _recursiveCreateFile(subpath, value);
        }
    });
}
//# sourceMappingURL=Directory.js.map