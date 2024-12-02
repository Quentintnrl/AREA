const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');

class ServiceData {
    constructor(name, id) {
        if (typeof name !== 'string' || typeof id !== 'number') {
            throw new Error("Invalid service data");
        }
        this._name = name;
        this._id = id;
    }

    get name() {
        return this._name;
    }

    get id() {
        return this._id;
    }
}

class ServiceManager {
    constructor(services) {
        let serviceFactory = new ServicesFactory();
        for (let service of services) {
            if (!(service instanceof ServiceData)) {
                throw new Error("Invalid service data");
            }
            this[service.name] = serviceFactory.createService(service.name, service.id);
        }
    }
}

module.exports = { ServiceData, ServiceManager };