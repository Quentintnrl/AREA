const { ServiceManager } = require('../Services/ServiceManager');
const disconnect = require('../db').close;

describe('ServiceManager', () => {

    it ('Should try to create a ServiceManager with unknow serviceData', async () => {
        // expect(() => new ServiceManager()).toThrowError("Unknown service type");
        let tmp = new ServiceManager();
        //await tmp.init();
        disconnect();
    });

});
