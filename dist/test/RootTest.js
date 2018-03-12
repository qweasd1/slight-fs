"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var process = require('process');
var Root_1 = require("../lib/Root");
var root = new Root_1.Root({
    rootDir: process.cwd()
});
it('create root', function () {
    var f = root.get("generate/b/a.txt");
    f.write("nice!");
    f.parent.parent.get("c.txt").write("nice");
    expect(f.read()).toEqual("nice!");
});
it('read relative path', function () {
    var f = root.get("generate/b/c/k");
    expect(f.relativeFilepath).toEqual("generate/b/c/k");
});
it('delete directory', function () {
    var directory = root.get("generate/b/");
    directory.remove();
});
it('move file', function () {
    // let directory:Directory = root.get("generate/a/b/")
    // directory.moveTo(root.get("generate/"))
    var file = root.get("generate/a/c.txt");
    file.moveTo(root.get("generate/b/"));
});
it('rename file', function () {
    var file = root.get("generate/b/c.txt");
    file.name = "d";
    file.name = "e";
});
it('rename file with fullname', function () {
    var file = root.get("generate/b/e.txt");
    file.fullname = "d.txt";
    file.fullname = "e.txt";
});
it('rename directory', function () {
    var directory = root.get("generate/a/");
    directory.name = "c";
    directory.name = "a";
});
it('check has', function () {
    var directory = root.get("generate/");
    expect(directory.has("a/")).toEqual(true);
    expect(directory.has("*/aaa")).toEqual(true);
    expect(directory.has("**/k")).toEqual(true);
    expect(directory.has("**/k", {
        ignore: ["b/c/k"]
    })).toEqual(false);
});
it('check find', function () {
    var directory = root.get("generate/");
    var children = directory.find("**/a*");
    expect(children[0].name).toEqual("a");
    expect(children[1].name).toEqual("aaa");
    expect(children.length).toEqual(2);
});
it('find ancestor by name', function () {
    var file = root.get("generate/a/b/c/k");
    var ancestor = file.ancestor.nameMatch("c");
    expect(ancestor.name).toEqual("c");
    expect(file.ancestor.nameMatch("generate").name).toEqual("generate");
});
it('find ancestor by string pattern', function () {
    var file = root.get("generate/a/b/c/k");
    var ancestor = file.ancestor.nameMatch(/g.*/);
    expect(ancestor.name).toEqual("generate");
});
it('find ancestor by has', function () {
    var file = root.get("generate/b/c/k");
    var ancestor = file.ancestor.has("k.txt");
    expect(ancestor.name).toEqual("b");
});
it('find ancestor by customize predicate', function () {
    var file = root.get("generate/b/c/k");
    var ancestor = file.ancestor.match(function (parent) { return parent.name.length > 3; });
    expect(ancestor.name).toEqual("generate");
});
it('test relativeTo ', function () {
    var file = root.get("generate/b/c/k");
    var dir = root.get("generate/b/");
    var dir2 = root.get("generate/a/");
    expect(file.relativepathTo(dir)).toEqual("c/k");
    expect(file.relativepathTo(dir, true)).toEqual("./c/k");
    expect(file.relativepathTo(dir2)).toEqual("../b/c/k");
});
// for windows, do we really need this?
// it('test windows relativeTo ', function () {
//
//   let file:File = root.get("generate/b/c/k")
//   let dir:Directory = root.get("generate/b/")
//   let dir2:Directory = root.get("generate/a/")
//   expect(file.relativepathTo(dir)).toEqual("c/k")
//   expect(file.relativepathTo(dir,true)).toEqual("./c/k")
//   expect(file.relativepathTo(dir2)).toEqual("../b/c/k")
// });
it('test bundle ', function () {
    var dir = root.get("generate/b/");
    dir.bunlde({
        "e": {
            "f.txt": dir.get("aaa").createReadStream()
        },
        "g.txt": "kkk"
    });
});
//# sourceMappingURL=RootTest.js.map