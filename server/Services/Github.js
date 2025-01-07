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

/**
 * Get the number of commits for a GitHub repository.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<number>} - The total number of commits.
 */
async function getCommitCount(owner, repo) {
    let page = 1;
    let commitCount = 0;
    const perPage = 100; // Maximum allowed per page

    try {
      while (true) {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/commits`,
          {
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

/**
 * Get the name and ID of all open pull requests for a private GitHub repository.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Promise<Array<{id: number, title: string}>>} - An array of objects containing the pull request ID and title.
 */
async function getOpenPullRequestsPrivate(owner, repo, token) {
    let page = 1;
    let pullRequests = [];
    const perPage = 100; // Maximum allowed per page

    try {
      while (true) {
        const response = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/pulls`,
          {
            headers: {
              'Authorization': `token ${token}`,
              'Accept': 'application/vnd.github.v3+json'
            },
            params: {
              per_page: perPage,
              page: page,
              state: 'open', // Only fetch open pull requests
            }
          }
        );

        // Extract pull request ID and title
        pullRequests = pullRequests.concat(
          response.data.map(pr => ({ id: pr.id, title: pr.title }))
        );

        // Check if there are more pull requests to fetch
        if (response.data.length < perPage) {
          break;
        }

        page++;
      }

      return pullRequests;
    } catch (error) {
      console.error('Error fetching pull requests:', error.message);
      throw error;
    }
}

/**
 * Get the name and ID of all open pull requests for a public GitHub repository.
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<Array<{id: number, title: string}>>} - An array of objects containing the pull request ID and title.
 */
async function getOpenPullRequestsPublic(owner, repo) {
  let page = 1;
  let pullRequests = [];
  const perPage = 100; // Maximum allowed per page

  try {
    while (true) {
      const response = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/pulls`,
        {
          headers: {
            'Accept': 'application/vnd.github.v3+json'
          },
          params: {
            per_page: perPage,
            page: page,
            state: 'open', // Only fetch open pull requests
          }
        }
      );

      // Extract pull request ID and title
      pullRequests = pullRequests.concat(
        response.data.map(pr => ({ id: pr.id, title: pr.title }))
      );

      // Check if there are more pull requests to fetch
      if (response.data.length < perPage) {
        break;
      }

      page++;
    }

    return pullRequests;
  } catch (error) {
    console.error('Error fetching pull requests:', error.message);
    throw error;
  }
}

/**
 * Get the number of followers for a GitHub user.
 * @param {string} username - The GitHub username.
 * @param {string} token - The GitHub Personal Access Token.
 * @returns {Promise<number>} - The number of followers.
 */
async function getFollowerCountPrivate(username, token) {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    return response.data.followers;
  } catch (error) {
    console.error('Error fetching follower count:', error.message);
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

/**
 * Check if the user has made a new public commit.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {number} treshold - The number of commits to check against.
 *
 * @returns {Promise<boolean>} - Returns true if the user has made a new commit.
 */
async function checkNewPublicCommit(owner, repo, treshold) {
    try {
        const commitCount = await getCommitCount(owner, repo);
        console.log('commitCount:', commitCount);
        if (commitCount > treshold) {
            console.log('New public commit');
            return true;
        }
        console.log('No new public commit');
        return false;
    } catch (error) {
        console.error('Error checking new public commit:', error);
        return false;
    }
}

/**
 * Check if the user has made a new private pull request.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {string} token - The GitHub Personal Access Token.
 * @param {Array<{id: number, title: string}>} previous_pullRequestTitles - The previous pull request titles.
 *
 * @returns {Promise<boolean>} - Returns true if the user has made a new pull request.
 */
async function checkNewPrivatePullRequest(owner, repo, token, previous_pullRequestTitles) {
    try {
      const pullRequestTitles = await getOpenPullRequestsPrivate(owner, repo, token);
      console.log('pullRequestTitles:', pullRequestTitles);
      let value = true;
      for (let i = 0; i < pullRequestTitles.length; i++) {
        value = true;
        for (let j = 0; j < previous_pullRequestTitles.length; j++) {
              if (pullRequestTitles[i].id === previous_pullRequestTitles[j].id) {
                  value = false;
              }
            }
            if (value) {
              console.log('New private pull request');
              return true;
            }
        }
        console.log('No new private pull request');
        return value;
    } catch (error) {
        console.error('Error checking new private pull request:', error);
        return false;
    }
}

/**
 * Check if the user has made a new public pull request.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @param {Array<{id: number, title: string}>} previous_pullRequestTitles - The previous pull request titles.
 *
 * @returns {Promise<boolean>} - Returns true if the user has made a new pull request.
 */
async function checkNewPublicPullRequest(owner, repo, previous_pullRequestTitles) {
    try {
      const pullRequestTitles = await getOpenPullRequestsPublic(owner, repo);
      console.log('pullRequestTitles:', pullRequestTitles);
      let value = true;
      for (let i = 0; i < pullRequestTitles.length; i++) {
        value = true;
        for (let j = 0; j < previous_pullRequestTitles.length; j++) {
          if (pullRequestTitles[i].id === previous_pullRequestTitles[j].id) {
            value = false;
          }
        }
        if (value) {
          console.log('New public pull request');
          return true;
        }
      }
      console.log('No new public pull request');
      return value;
    } catch (error) {
      console.error('Error checking new public pull request:', error);
      return false;
    }
}

/**
 * Check if the user has gained a new follower.
 *
 * @param {string} username - The GitHub username.
 * @param {string} token - The GitHub Personal Access Token.
 * @param {number} treshold - The number of followers to check against.
 *
 * @returns {Promise<boolean>} - Returns true if the user has gained a new follower.
 */
async function checkNewFollower(username, token, treshold) {
    try {
        const followerCount = await getFollowerCountPrivate(username, token);
        console.log('followerCount:', followerCount);
        if (followerCount > treshold) {
            console.log('New follower');
            return true;
        }
        console.log('No new follower');
        return false;
    } catch (error) {
        console.error('Error checking new follower:', error);
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
                const owner = request_json.params["Owner"];
                const repo = request_json.params["Repo Url"];
                console.log('owner:', owner);
                console.log('repo:', repo);
                const commitCount = await getCommitCount(owner, repo);
                console.log('commitCount:', commitCount);
                const json = {
                    id: request_json.id,
                    params: {
                        owner: owner,
                        repo_url: repo,
                        commit_count: commitCount
                    }
                };
                return json;
            }

            case 'New private pullrequest': {
                console.log(request_json);
                const owner = request_json.params["Owner"];
                const repo = request_json.params["Repo Url"];
                const token = request_json.params["Token"];
                console.log('owner:', owner);
                console.log('repo:', repo);
                const pullRequestTitles = await getOpenPullRequestsPrivate(owner, repo, token);
                console.log('pullRequestTitles:', pullRequestTitles);
                const json = {
                    id: request_json.id,
                    params: {
                        owner: owner,
                        repo_url: repo,
                        token: token,
                        pull_request_titles: pullRequestTitles
                    }
                };
                return json;
            }

            case 'New public pullrequest': {
                console.log(request_json);
                const owner = request_json.params["Owner"];
                const repo = request_json.params["Repo Url"];
                console.log('owner:', owner);
                console.log('repo:', repo);
                const pullRequestTitles = await getOpenPullRequestsPublic(owner, repo);
                console.log('pullRequestTitles:', pullRequestTitles);
                const json = {
                    id: request_json.id,
                    params: {
                        owner: owner,
                        repo_url: repo,
                        pull_request_titles: pullRequestTitles
                    }
                };
                return json;
            }

            case 'New private followers': {
              console.log(request_json);
              const username = request_json.params["User"];
              console.log('username:', username);
              const token = request_json.params["Token"];
              console.log('token:', token);
              const followerCount = await getFollowerCountPrivate(username, token);
              console.log('followerCount:', followerCount);
              const json = {
                  id: request_json.id,
                  params: {
                      user: username,
                      token: token,
                      follower_count: followerCount
                  }
              };
              return json;
            }

            case 'New public followers': {
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
                    const owner = task.params["owner"];
                    const repo = task.params["repo_url"];
                    if (await checkNewPublicCommit(owner, repo, task.params["commit_count"])) {
                        value = true;
                    }
                    if (task.params["commit_count"] != await getCommitCount(owner, repo)) {
                        const new_commit_count = await getCommitCount(owner, repo);
                        console.log('New public count', new_commit_count);
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

                case 'New private pullrequest': {
                  console.log(task);
                  const owner = task.params["owner"];
                  console.log('owner:', owner);
                  const repo = task.params["repo_url"];
                  console.log('repo:', repo);
                  const token = task.params["token"];
                  const previous_pullRequestTitles = task.params["pull_request_titles"];
                  console.log('previous_pullRequestTitles:', previous_pullRequestTitles);
                  if (await checkNewPrivatePullRequest(owner, repo, token, previous_pullRequestTitles)) {
                      value = true;
                  }
                  const pullRequestTitles = await getOpenPullRequestsPrivate(owner, repo, token);
                  console.log('pullRequestTitles:', pullRequestTitles);
                  const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                  console.log('action_reaction:', action_reaction[0]);
                  let action = action_reaction[0].action;
                  let params = action.params;
                  console.log('params:', params);
                  params["pull_request_titles"] = pullRequestTitles;
                  console.log('new params:', params);
                  action.params = params;
                  console.log('new action:', action);
                  await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                  break;
              }

              case 'New public pullrequest': {
                  console.log(task);
                  const owner = task.params["owner"];
                  console.log('owner:', owner);
                  const repo = task.params["repo_url"];
                  console.log('repo:', repo);
                  const previous_pullRequestTitles = task.params["pull_request_titles"];
                  console.log('previous_pullRequestTitles:', previous_pullRequestTitles);
                  if (await checkNewPublicPullRequest(owner, repo, previous_pullRequestTitles)) {
                      value = true;
                  }
                  const pullRequestTitles = await getOpenPullRequestsPublic(owner, repo);
                  console.log('pullRequestTitles:', pullRequestTitles);
                  const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                  console.log('action_reaction:', action_reaction[0]);
                  let action = action_reaction[0].action;
                  let params = action.params;
                  console.log('params:', params);
                  params["pull_request_titles"] = pullRequestTitles;
                  console.log('new params:', params);
                  action.params = params;
                  console.log('new action:', action);
                  await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                  break;
              }

              case 'New private followers': {
                console.log(task);
                const username = task.params["user"];
                console.log('username:', username);
                const token = task.params["token"];
                if (await checkNewFollower(username, token, task.params["follower_count"])) {
                    value = true;
                }
                if (task.params["follower_count"] != await getFollowerCountPrivate(username, token)) {
                    const new_follower_count = await getFollowerCountPrivate(username, token);
                    console.log('New follower count', new_follower_count);
                    const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                    console.log('action_reaction:', action_reaction[0]);
                    let action = action_reaction[0].action;
                    let params = action.params;
                    console.log('params:', params);
                    params["follower_count"] = new_follower_count;
                    console.log('new params:', params);
                    action.params = params;
                    console.log('new action:', action);
                    await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                }
                break;
              }

              case 'New public followers': {
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
