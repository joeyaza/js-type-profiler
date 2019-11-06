import * as inspector from "inspector";
declare class InspectorSession extends inspector.Session {
    constructor();
    postAsync(...args: any[]): Promise<any>;
}
export default InspectorSession;
