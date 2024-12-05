const { ServiceData, ServiceManager } = require('../Services/ServiceManager');

let serviceData1 = new ServiceData("test1", 1);
let serviceData2 = new ServiceData("test2", 2);
let serviceDatas = [serviceData1, serviceData2];

describe('ServiceManager', () => {

    it ('Should try to create a ServiceManager with unknow serviceData', () => {
        expect(() => new ServiceManager(serviceDatas)).toThrowError("Unknown service type");
    });

    it ('Should try to create a ServiceManager witout array of string', () => {
        expect(() => new ServiceManager(["ok", "test"])).toThrowError("Invalid service data");
    });

});
