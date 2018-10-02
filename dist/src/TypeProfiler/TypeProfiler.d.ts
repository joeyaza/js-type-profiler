export declare class TypeProfiler {
    constructor();
    start(script?: string): Promise<any>;
    private readFile(fileName);
    private collectTypeProfile(source);
    private markUpCode(entries, source);
    private getPostBody(request);
    private server(request, response);
}
