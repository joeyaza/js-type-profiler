"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inspector = require("inspector");
class InspectorSession extends inspector.Session {
    constructor() {
        super();
    }
    postAsync(...args) {
        let session = this;
        return new Promise((resolve, reject) => {
            session.post(...args, (error, result) => {
                if (error || result.exceptionDetails) {
                    return reject(error || result.exceptionDetails.exception.description);
                }
                return resolve(result);
            });
        });
    }
}
exports.default = InspectorSession;
//# sourceMappingURL=InspectorSession.js.map