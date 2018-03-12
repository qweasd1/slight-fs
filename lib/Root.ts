import {Node} from './Node'
import {Directory, FileOrDirectory} from './Directory'

const path = require('path')

export class Root extends Directory{
  public nodeCache = new Map<string,FileOrDirectory>();

  constructor(public config: RootConfig) {
    super()
    // turn root to absolute filepath
    this.absoluteFilepath = path.resolve(config.rootDir)


    this.nodeCache.set(this.absoluteFilepath,this)
    this.root = this
    this.isRoot = true
  }
}


export interface RootConfig {
  rootDir:string,
  fs?:any
}

