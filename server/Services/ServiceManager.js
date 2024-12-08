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
}

module.exports = { ServiceManager };