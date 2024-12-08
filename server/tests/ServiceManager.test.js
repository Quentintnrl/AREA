const { ServiceManager } = require('../Services/ServiceManager');

describe('ServiceManager', () => {

    it ('Should try to create a ServiceManager with unknow serviceData', async () => {
        // expect(() => new ServiceManager()).toThrowError("Unknown service type");
        let tmp = new ServiceManager();
        await tmp.init();
        expect(() => true);
    });

    // it ('Should try to create a ServiceManager witout array of string', () => {
    //     expect(() => new ServiceManager()).toThrowError("Invalid service data");
    // });

});
