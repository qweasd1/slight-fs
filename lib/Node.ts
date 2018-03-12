import {Root} from "./Root";
import {Directory, FileOrDirectory, GlobOptions} from "./Directory";
import {platform} from './util'


const fs = require('fs')
const path = require('path')

export type ParentMatcherFn  = (node:Directory)=>boolean



export class Ancestor {

  constructor(private node:Node){

  }
  match(predicate:ParentMatcherFn):(Directory | null){
    let parent = this.node.parent
    let isSuccess = false
    while (true){
      isSuccess = predicate(parent)
      if(isSuccess){
        break
      }
      else {
        if(parent.isRoot){
          break
        }
        else {
          parent = parent.parent
        }
      }
    }

    if(isSuccess){
      return parent
    }
    else {
      return null
    }
  }
  has(pattern:string,options?:GlobOptions):Directory {
    const predicate = (node:Directory)=>{
      return node.has(pattern,options)
    }
    return this.match(predicate)
  }
  nameMatch(pattern:RegExp | string):Directory{
    let predicate
    if(pattern instanceof RegExp){
      predicate = (node:Directory)=>{
        return !!pattern.exec(node.name)
      }
    }
    else {
      predicate = (node:Directory)=>{
        return node.name === pattern
      }
    }
    return this.match(predicate)
  }
}



export abstract class Node {

  public isRoot:boolean = false
  public parent:Directory
  public root:Root

  // full file path for this node
  public absoluteFilepath:string
  get relativeFilepath():string {
    return path.relative(this.root.absoluteFilepath,this.absoluteFilepath)
  }

  // for ancestor matching
  ancestor:Ancestor

  constructor(

  ){
  }

  public abstract name:string

  public exists(){
    return fs.existsSync(this.absoluteFilepath)
  }

  // calculate relative path to given node
  relativepathTo(node:Node,hasPrefix:boolean = false):string{
    const originResult:string = path.relative(node.absoluteFilepath,this.absoluteFilepath)

    const prefix = hasPrefix ? "./" : ""
    if(originResult[0] == "."){
      return originResult
    }
    else {
      return prefix + originResult
    }

  }

  public abstract remove();
  public moveTo(newParent:string | Directory){
    if(newParent instanceof Directory){
      const newAbsoluteFilepath = path.join(newParent.absoluteFilepath,path.basename(this.absoluteFilepath))
      fs.renameSync(this.absoluteFilepath,newAbsoluteFilepath)
      this._updateCache(newAbsoluteFilepath)
      this.absoluteFilepath = newAbsoluteFilepath
    }
  }


  // helper methods

  protected _updateCache(newAbsoluteFilepath:string){
    this.root.nodeCache.delete(this.absoluteFilepath)
    this.absoluteFilepath = newAbsoluteFilepath
    this.root.nodeCache.set(newAbsoluteFilepath,this)
  }
}