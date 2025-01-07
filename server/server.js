require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./Router/Router.js');
const pool = require('./db').connection;
// const pool = require('./db').close;
const { ServiceManager } = require('./Services/ServiceManager');

let serviceManager = new ServiceManager();
serviceManager.init();

async function serviceManagerLoop() {
    /*while (true) {
        console.log('SERVICE MANAGER LOOP');
        const [action_reactions] = await pool.query('SELECT * FROM action_reaction');
        for (let i = 0; i < action_reactions.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
                console.log(action_reactions[i]);
                const user_id = action_reactions[i].user_id;
                console.log(user_id);
                const action = action_reactions[i].action;
                console.log(action);
                const actionId = action.id;
                console.log(actionId);
                const actionParam = action.params;
                console.log('action params', actionParam);
                if (await serviceManager.checkAction(user_id, actionParam, actionId, action_reactions[i].id)) {
                    console.log('Action is valid');
                    const reaction = action_reactions[i].reaction;
                    console.log(reaction);
                    const reactionParam = reaction.params;
                    console.log('reaction params', reactionParam);
                    const reactionId = reaction.id;
                    console.log(reactionId);
                    await serviceManager.executeReaction(user_id, reactionParam, reactionId, action_reactions[i].id);
                }
                // return;
            } catch (error) {
                console.error('Error fetching data from actions table:', error);
            }
            continue;
            const reaction = action_reactions[i].reaction;
            console.log(reaction);
        }
    }*/
}

const YAML = require('yamljs')
const swaggerDoc = YAML.load('./Router/swagger.yml')
const swaggerUI = require('swagger-ui-express')

const app = express();
const port = 8080;

app.use(cors());
app.use('/', router());
app.use(
        "/api-docs",
        swaggerUI.serve,
        swaggerUI.setup(swaggerDoc)
    )

app.listen(port, () => {
    console.log('Server app listening on port ' + port);

    // Run the loop in parallel using Parallel.js
    serviceManagerLoop();
});
