declare const InspectorSession: any;
declare const http: any;
declare const query: any;
declare const fs: any;
declare const inspectorSession: InspectorSession;
declare class TypeProfiler {
    constructor();
    start(): Promise<string>;
    readFile(file_name: any): Promise<{}>;
    collectTypeProfile(source: any): Promise<string>;
    markUpCode(entries: any, source: any): any;
    getPostBody(request: any): Promise<{}>;
}
