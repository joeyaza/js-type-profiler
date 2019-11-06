declare class TypeProfiler {
    constructor();
    start(req: any, res: any): Promise<any>;
    private isJavaScriptValid;
    private collectTypeProfile;
    private markUpCode;
}
export default TypeProfiler;
