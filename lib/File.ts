import {Node} from './Node';
import ReadStream = NodeJS.ReadStream;

const fs = require('fs')
const path = require('path')
const stream = require('stream')



export class File extends Node {
  remove() {
    fs.unlinkSync(this.absoluteFilepath)
  }

  constructor(){
    super()
  }

  get name():string{
    return path.basename(this.absoluteFilepath,this.extension)
  }

  set name(value:string){
    const newAbsoluteFilepath = path.join(path.dirname(this.absoluteFilepath),value + path.extname(this.absoluteFilepath))
    fs.renameSync(this.absoluteFilepath,newAbsoluteFilepath)
    this._updateCache(newAbsoluteFilepath)
  }

  get fullname():string {
    return path.basename(this.absoluteFilepath)
  }

  set fullname(value:string){
    const newAbsoluteFilepath = path.join(path.dirname(this.absoluteFilepath),value)
    fs.renameSync(this.absoluteFilepath,newAbsoluteFilepath)
    this._updateCache(newAbsoluteFilepath)
  }

  get extension():string {
    return path.extname(this.absoluteFilepath)
  }

  read(options?):string{
    return fs.readFileSync(this.absoluteFilepath,options).toString()
  }

  write(text:string,options?){
    fs.writeFileSync(this.absoluteFilepath,text,options)
  }

  writeFromStream(stream:ReadStream){
    stream.pipe(fs.createWriteStream(this.absoluteFilepath))
  }

  createReadStream():ReadStream {
    return fs.createReadStream(this.absoluteFilepath)
  }

}