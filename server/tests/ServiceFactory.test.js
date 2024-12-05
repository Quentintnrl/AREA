const { ServicesFactory } = require('../Services/ServicesFactory');

describe('AbstractService', () => {

    it('Should create a ServiceFactory', () => {
        const serviceFactory = new ServicesFactory();
        expect(serviceFactory).toBeInstanceOf(ServicesFactory);
    });

    it('Should failed to return a service', () => {
        const serviceFactory = new ServicesFactory();
        expect(() => serviceFactory.createService("test", 1)).toThrowError("Unknown service type");
    });
});