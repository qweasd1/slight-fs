/// <reference types="es6-collections" />
import { Directory } from './Directory';
export declare class Root extends Directory {
    config: RootConfig;
    nodeCache: Map<string, any>;
    constructor(config: RootConfig);
}
export interface RootConfig {
    rootDir: string;
    fs?: any;
}
