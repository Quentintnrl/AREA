const { spotify_login_url } = require('./Spotify').getLoginLink();
const pool = require('../db').connection;
const disconnect = require('../db').close;

async function getLoginLink(service_id) {
    try {
        const service = await pool.query('SELECT * FROM services WHERE id = ?', [service_id]);
        switch (service.name) {
            case 'Spotify':
                disconnect();
                return spotify_login_url;
            default:
                throw new Error('Service not supported');
        }
    } catch (error) {
        console.error('Error fetching data from services table:', error);
        disconnect();
        return '';
    }
    disconnect();
    return '';
}

module.exports = { getLoginLink };