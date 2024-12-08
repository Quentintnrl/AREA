const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');
const pool = require('../db')

const query = async () => {
    try {
      // Execute the query to get all rows from the 'services' table
      const [rows] = await pool.query('SELECT id, name FROM services');

      // Format the result as an array of objects (if needed)
      const services = rows.map(row => ({ id: row.id, name: row.name }));

      // Log or use the resulting array
      console.log(services);
      return services;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  };

class ServiceManager {
    constructor() {
        this.services = [];
    }

    async init() {
        try {
            this.services = await query();
            console.log('ServiceManager initialized');
        } catch (error) {
            console.error('Error initializing ServiceManager:', error);
            throw error;
        }
    }

    // async startService(serviceId) {
    //     try {
    //         const service = this.services.find(s => s.id === serviceId);
    //         if (!service) {
    //             throw new Error(`Service with id ${serviceId} not found`);
    //         }

    //         const serviceInstance = ServicesFactory.createService(service.name);
    //         if (!serviceInstance) {
    //             throw new Error(`Service ${service.name} not found`);
    //         }

    //         await serviceInstance.init();
    //         await serviceInstance.start();
    //         console.log(`Service ${service.name} started`);
    //     } catch (error) {
    //         console.error('Error starting service:', error);
    //         throw error;
    //     }
    // }

    // async stopService(serviceId) {
    //     try {
    //         const service = this.services.find(s => s.id === serviceId);
    //         if (!service) {
    //             throw new Error(`Service with id ${serviceId} not found`);
    //         }

    //         const serviceInstance = ServicesFactory.createService(service.name);
    //         if (!serviceInstance) {
    //             throw new Error(`Service ${service.name} not found`);
    //         }

    //         await serviceInstance.stop();
    //         console.log(`Service ${service.name} stopped`);
    //     } catch (error) {
    //         console.error('Error stopping service:', error);
    //         throw error;
    //     }
    // }
}

module.exports = { ServiceManager };