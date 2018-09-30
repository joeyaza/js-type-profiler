declare const inspector: any;
declare class InspectorSession extends inspector.Session {
    constructor();
    postAsync(...args: any[]): Promise<{}>;
}
