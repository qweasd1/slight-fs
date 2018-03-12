/// <reference types="node" />
import { Node } from './Node';
import ReadStream = NodeJS.ReadStream;
export declare class File extends Node {
    remove(): void;
    constructor();
    name: string;
    fullname: string;
    readonly extension: string;
    read(options?: any): string;
    write(text: string, options?: any): void;
    writeFromStream(stream: ReadStream): void;
    createReadStream(): ReadStream;
}
