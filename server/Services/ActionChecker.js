const { ServiceManager } = require('./ServiceManager');
const pool = require('../db').connection;
const disconnect = require('../db').close;

const printActionReactionTable = async () => {
    try {
        // Use await to ensure the query resolves before moving to the next part
        const [rows] = await pool.query('SELECT * FROM action_reaction');
        // Print the result rows
        console.log('action_reaction Table Contents:');
        rows.forEach(row => {
            console.log(`user_id: ${row.user_id}, action: ${JSON.stringify(row.action)}, reaction: ${JSON.stringify(row.reaction)}`);
        });
    } catch (error) {
        // Log full error details if message is unavailable
        console.error('Error fetching data from action_reaction table:', error);
    }
};

const getActionReactionTable = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM action_reaction');
        return rows;
    } catch (error) {
        console.error('Error fetching data from action_reaction table:', error);
        return [];
    }
}

class ActionChecker {
    constructor(ServiceManagerInstance) {
        // Ensure the ServiceManagerInstance is valid
        if (!(ServiceManagerInstance instanceof ServiceManager)) {
            throw new Error('ServiceManagerInstance must be an instance of ServiceManager');
        }

        this.ServiceManager = ServiceManagerInstance;
        this.run = false;
        this.startPromise = null; // To track the running Promise
    }

    async start() {
        // If already running, don't start a new loop
        if (this.startPromise) {
            console.log("Already running.");
            return;
        }

        this.run = true;
        this.startPromise = new Promise(async (resolve, reject) => {
            try {
                while (this.run) {
                    // await printActionReactionTable();
                    const rows = await getActionReactionTable();
                    for (const row of rows) {
                        // Check if the action is valid
                        const actionId = JSON.parse(row.action).id;
                        console.log(`Checking action ${actionId}...`);
                        const actionParams = JSON.parse(row.action).params;
                        console.log(`Action params: ${JSON.stringify(actionParams)}`);
                        await this.ServiceManager.checkAction(actionId, actionParams);
                    }
                    await new Promise(r => setTimeout(r, 1000)); // Simulate wait
                }
            } catch (error) {
                console.error("Error in start loop:", error);
            } finally {
                resolve();
                this.startPromise = null; // Reset the promise when done
            }
        });

        console.log("Started processing...");
    }

    async stop() {
        if (!this.run) {
            console.log("Not running.");
            return;
        }

        this.run = false;
        try {
            // Wait for the start process to complete
            await this.startPromise;
            console.log("Stopped processing...");
        } catch (error) {
            console.error("Error while stopping:", error);
        }
    }
}

module.exports = { ActionChecker };
