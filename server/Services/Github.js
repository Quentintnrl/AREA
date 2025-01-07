const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');




//                                                                             GITHUB API

/**
 * Get the number of commits for a private GitHub repository using an access token.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Promise<number>} - The total number of commits.
 */

async function getPrivateCommitCount(owner, repo, token) {
    let page = 1;
    let commitCount = 0;
    const perPage = 100; // Maximum allowed per page

    try {
      while (true) {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits`,
          {
            headers: {
              'Authorization': `token ${token}`
            },
            params: {
              per_page: perPage,
              page: page,
            }
          }
        );

        commitCount += response.data.length;

        // Check if there are more commits to fetch
        if (response.data.length < perPage) {
          break;
        }

        page++;
      }

      return commitCount;
    } catch (error) {
      console.error('Error fetching commits:', error.message);
      throw error;
    }
}




//                                                                             ACTIONS

/**
 * Check if the user has made a new private commit.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @param {number} treshold - The number of commits to check against.
 *
 * @returns {Promise<boolean>} - Returns true if the user has made a new commit.
 */
async function checkNewPrivateCommit(owner, repo, token, treshold) {
    try {
        const commitCount = await getPrivateCommitCount(owner, repo, token);
        console.log('commitCount:', commitCount);
        if (commitCount > treshold) {
            console.log('New private commit');
            return true;
        }
        console.log('No new private commit');
        return false;
    } catch (error) {
        console.error('Error checking new private commit:', error);
        return false;
    }
}




//                                                                             JSON CREATION

/**
 * Create the json for the Github actions and reactions.
 *
 * @param {JSON} request_json - The json send in the request.
 * @param {string} target_name - The name of the action/reaction.
 * @returns {Promise<string>} - Returns the json for the database.
 */
async function create_json(request_json, target_name, user_id, service_id) {
    console.log('user_id:', user_id);
    console.log('service_id:', service_id);
    try {
        console.log('Creating json for:\"', target_name, '\"');
        switch (target_name) {
            //actions

            case 'New private commit': {
                console.log(request_json);
                const owner = request_json.params["Owner"];
                const repo = request_json.params["Repo Url"];
                const token = request_json.params["Token"];
                console.log('owner:', owner);
                console.log('repo:', repo);
                console.log('token:', token);
                const commitCount = await getPrivateCommitCount(owner, repo, token);
                console.log('commitCount:', commitCount);
                const json = {
                    id: request_json.id,
                    params: {
                        owner: owner,
                        repo_url: repo,
                        token: token,
                        commit_count: commitCount
                    }
                };
                return json;
            }

            case 'New public commit': {
                console.log(request_json);
            }

            //reactions

            default: {
                throw new Error('Action/Reaction not supported');
            }
        }
    } catch (error) {
        console.error('Error creating json:', error);
    }
}





//                                                                             Github class

class Github extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Github service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;

        try {
            switch (task.name) {
                //actions

                case 'New private commit': {
                    console.log(task);
                    const owner = task.params["owner"];
                    const repo = task.params["repo_url"];
                    const token = task.params["token"];
                    if (await checkNewPrivateCommit(owner, repo, token, task.params["commit_count"])) {
                        value = true;
                    }
                    if (task.params["commit_count"] != await getPrivateCommitCount(owner, repo, token)) {
                        const new_commit_count = await getPrivateCommitCount(owner, repo, token);
                        console.log('New private count', new_commit_count);
                        const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                        console.log('action_reaction:', action_reaction[0]);
                        let action = action_reaction[0].action;
                        let params = action.params;
                        console.log('params:', params);
                        params["commit_count"] = new_commit_count;
                        console.log('new params:', params);
                        action.params = params;
                        console.log('new action:', action);
                        await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                    }
                    break;
                }

                case 'New public commit': {
                    console.log(task);
                    break;
                }

                //reactions

                default: {
                    throw new Error('Action/Reaction not supported');
                }
            }
        } catch (error) {
            console.error('Error creating json:', error);
        }
        return value;
    }
}

module.exports = { Github, create_json };
