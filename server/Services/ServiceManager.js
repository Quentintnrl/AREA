const { AbstractService, Task } = require('./AbstractService');
const { ServicesFactory } = require('./ServicesFactory');
const pool = require('../db').connection;
const disconnect = require('../db').close;

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
        this.servicesFactory = new ServicesFactory();
        this.servicesMap = new Map();
    }

    async init() {
        try {
            this.services = await query();
            for (const service of this.services) {
                const serviceInstance = this.servicesFactory.createService(service.name, service.id);
                // this.servicesMap.set(service.name, serviceInstance);
            }
            console.log('ServiceManager initialized');
        } catch (error) {
            console.error('Error initializing ServiceManager:', error);
            throw error;
        }
    }
}

module.exports = { ServiceManager };