import { Root } from "./Root";
import { Directory, GlobOptions } from "./Directory";
export declare type ParentMatcherFn = (node: Directory) => boolean;
export declare class Ancestor {
    private node;
    constructor(node: Node);
    match(predicate: ParentMatcherFn): (Directory | null);
    has(pattern: string, options?: GlobOptions): Directory;
    nameMatch(pattern: RegExp | string): Directory;
}
export declare abstract class Node {
    isRoot: boolean;
    parent: Directory;
    root: Root;
    absoluteFilepath: string;
    readonly relativeFilepath: string;
    ancestor: Ancestor;
    constructor();
    abstract name: string;
    exists(): any;
    relativepathTo(node: Node, hasPrefix?: boolean): string;
    abstract remove(): any;
    moveTo(newParent: string | Directory): void;
    protected _updateCache(newAbsoluteFilepath: string): void;
}
