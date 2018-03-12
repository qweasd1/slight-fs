import { Node } from './Node';
import { File } from './File';
export declare type FileOrDirectory = File | Directory | any;
export declare class Directory extends Node {
    constructor();
    name: string;
    find(patten: string, options?: GlobOptions): FileOrDirectory[];
    get(relativePath: string): FileOrDirectory;
    has(globPattern: string, options?: GlobOptions): boolean;
    bunlde(bundleObj: object): void;
    remove(): void;
    _glob(pattern: string, options: GlobOptions): any;
    _recursiveCreateParent(filePath: string): Directory;
    _createDirectory(absolutePath: string): Directory;
    _createFile(absolutePath: string, createFileOnDisk?: boolean): File;
}
export interface GlobOptions {
    cwd?: string;
    ignore?: string | string[];
}
