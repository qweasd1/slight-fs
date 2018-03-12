import {Node,Ancestor} from './Node';
import {File} from './File';
import {Root} from "./Root";

const mkdirp = require('mkdirp').sync
const fs = require('fs')
const path = require('path')
const glob = require('glob').sync

export type FileOrDirectory = File | Directory | any

export class Directory extends Node {

  constructor() {
    super()
  }

  get name(): string {
    return path.basename(this.absoluteFilepath)
  }

  set name(value: string) {
    const newAbsoluteFilepath = path.join(path.dirname(this.absoluteFilepath), value)
    fs.renameSync(this.absoluteFilepath, newAbsoluteFilepath)
    this._updateCache(newAbsoluteFilepath)
  }

  find(patten: string, options: GlobOptions = {}): FileOrDirectory[] {
    return this._glob(patten, options).map(x => {
      return this.get(x)
    })
  }


  get(relativePath: string): FileOrDirectory {


    const isDirectory = relativePath.charAt(relativePath.length - 1) === "/"
    const fileAbsolutePath = path.resolve(this.absoluteFilepath, relativePath)

    if (fs.existsSync(fileAbsolutePath)) {
      if (this.root.nodeCache.has(fileAbsolutePath)) {
        return this.root.nodeCache.get(fileAbsolutePath)
      }
      else {
        if (isDirectory) {
          const parent = this._recursiveCreateParent(fileAbsolutePath)
          const directory = this._createDirectory(fileAbsolutePath)
          directory.parent = parent
          return directory
        }
        else {
          const parent = this._recursiveCreateParent(fileAbsolutePath)
          const file = this._createFile(fileAbsolutePath, false)
          file.parent = parent
          return file
        }
      }
    }
    else {
      if (isDirectory) {
        mkdirp(fileAbsolutePath)
        const parent = this._recursiveCreateParent(fileAbsolutePath)
        const directory = this._createDirectory(fileAbsolutePath)
        directory.parent = parent
        return directory
      }
      else {
        const parentPath = path.dirname(fileAbsolutePath)
        mkdirp(parentPath)
        const parent = this._recursiveCreateParent(fileAbsolutePath)
        const file = this._createFile(fileAbsolutePath, true)
        file.parent = parent
        return file
      }
    }

  }

  has(globPattern: string, options: GlobOptions = {}) {
    if (this._glob(globPattern, options).length > 0) {
      return true
    }
    else {
      return false
    }
  }

  bunlde(bundleObj:object) {
    _recursiveCreateFile(this.absoluteFilepath,bundleObj)
  }

  remove() {
    _removeDirectoryRecursive(this.absoluteFilepath)
  }


  _glob(pattern: string, options: GlobOptions) {
    options.cwd = this.absoluteFilepath
    return glob(pattern, options)
  }

  // helpers
  _recursiveCreateParent(filePath: string): Directory {
    let parentPath = path.dirname(filePath)
    const parents: Directory[] = []
    while (!this.root.nodeCache.has(parentPath)) {
      parents.push(this._createDirectory(parentPath))
      parentPath = path.dirname(parentPath)
    }
    parents.push(<Directory>this.root.nodeCache.get(parentPath))

    for (let i = 0; i < parents.length - 1; i++) {
      parents[i].parent = parents[i + 1]
    }

    return parents[0]
  }


  _createDirectory(absolutePath: string): Directory {
    const directory = new Directory();
    directory.absoluteFilepath = absolutePath
    directory.root = this.root
    directory.ancestor = new Ancestor(directory);
    this.root.nodeCache.set(absolutePath, directory)

    return directory
  }

  _createFile(absolutePath: string, createFileOnDisk: boolean = false): File {
    const file = new File();
    file.absoluteFilepath = absolutePath
    file.root = this.root
    file.ancestor = new Ancestor(file);
    this.root.nodeCache.set(absolutePath, file)
    if (createFileOnDisk) {
      file.write("");
    }
    return file
  }
}

export interface GlobOptions {
  cwd?: string,
  ignore?: string | string[]
}

function _removeDirectoryRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file, index) {
      var curPath = path + "/" + file;
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        _removeDirectoryRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};


function _recursiveCreateFile(root:string,bundleObj:object){
  Object.keys(bundleObj).forEach((key)=>{
    const value = bundleObj[key]
    const subpath = path.join(root,key)
    if(value instanceof fs.ReadStream){
      value.pipe(fs.createWriteStream(subpath))
    }
    else if(typeof value === "string"){
      fs.writeFileSync(subpath,value)
    }
    else {

      if(!fs.existsSync(subpath)){
        fs.mkdirSync(subpath)
      }
      _recursiveCreateFile(subpath,value)
    }

  })
}
