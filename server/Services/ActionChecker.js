const { ServiceManager } = require('./ServiceManager');

class ActionChecker {
    constructor(ServiceManager) {
        if (ServiceManager === undefined) {
            throw new Error('ServiceManager is required');
        }
        if (!(ServiceManager instanceof ServiceManager)) {
            throw new Error('ServiceManager must be an instance of ServiceManager');
        }
        this.ServiceManager = ServiceManager;
    };
}

module.exports = { ActionChecker };