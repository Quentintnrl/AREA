const { AbstractService, Task } = require('./AbstractService');
const pool = require('../db').connection;
const disconnect = require('../db').close;
const axios = require('axios');
const querystring = require('querystring');

// Spotify API Credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

/**
 * Check if the params for the action that is triggered when a track is added to a playlist
 *
 * @param {JSON} params - The parameters of the action
 * @returns {boolean} - Return true if the params are good for this actions
 */
async function checkTrackAddedToAPlaylist(params, user_id, service_id) {
    try {
        console.log('params: ', params["Playlist Uri"]);
        console.log('service id: ', service_id);
        const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        console.log('tokens: ', user_tokens[0].connect_token);
        const access_token = user_tokens[0].connect_token["access token"];
        console.log('access token: ', access_token);
        if (!await isAccessTokenValid(access_token)) {
            const refresh_token = user_tokens[0].connect_token["refresh token"];
            const access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
            user_tokens[0].connect_token["access token"] = access_token;
            console.log(user_tokens[0].connect_token);
            await pool.query(
                `UPDATE users_services_login
                 SET connect_token = JSON_SET(connect_token, '$."access token"', ?, '$."refresh token"', ?)
                 WHERE user_id = ? AND service_id = ?`,
                [access_token, refresh_token, user_id, service_id]
            );
        }
        if (!await doesPlaylistExist(access_token, params["Playlist Uri"])) {
            console.error('Playlist doesn\'t exist');
            return false
        }
    } catch (error) {
        console.error(error);
        console.error('Bad parameters for the action \"A track is added to a playlist\"');
        return false;
    }
    return true;
}

/**
 * Check if a the track that want to be target exist
 *
 * @param {JSON} params - The parameters of this reaction
 * @param {string} user_id - The id of the user
 * @param {string} servide_id - The id of the spotify service
 * @returns {boolean} - Return a boolean if the track exist
 */
async function checkPlayATrack(params, user_id, service_id) {
    try {
        console.log('params: ', params["Track Uri"]);
        console.log('service id: ', service_id);
        const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        console.log('tokens: ', user_tokens[0].connect_token);
        const access_token = user_tokens[0].connect_token["access token"];
        console.log('access token: ', access_token);
        if (!await isAccessTokenValid(access_token)) {
            console.log('Access token need to be refresh');
        }
        if (!await doesTrackExist(access_token, params["Track Uri"])) {
            console.error('Track doesn\'t exist');
            return false
        }
    } catch (error) {
        console.error(error);
        console.error('Bad parameters for the action \"A track is added to a playlist\"');
        return false;
    }
    return true;
}

/**
 * Check the different actions and reactions that can be done with Spotify.
 *
 * @param {JSON} params - The parameters of the action or reaction.
 * @param {string} name - The name of the action or reaction.
 * @returns {boolean} - Returns true if the action or reaction is valid; otherwise, false.
 */
async function checkSpotifyActionReaction(params, name, user_id, service_id) {
    console.log('name: ', name);
    console.log('service id: ', service_id);
    console.log('params', params);
    try {
        switch (name) {
            case 'A track is added to a playlist':
                return await checkTrackAddedToAPlaylist(params, user_id, service_id);
            case 'play a track':
                return await checkPlayATrack(params, user_id, service_id);
            default:
                throw new Error('Action or reaction not supported');
        }
    } catch (error) {
        console.error('Error checking Spotify action or reaction:', error);
        throw new Error('Failed to check Spotify action or reaction.');
    }
}

/**
 * Return the login link for Spotify.
 *
 * @returns {string} - The login link.
*/
function getLoginLink() {
    const scopes = [
        'user-read-playback-state',
        'user-modify-playback-state',
        'playlist-read-private',
        'playlist-modify-private',
        'playlist-modify-public',
    ].join(' ');

    const authUrl = `https://accounts.spotify.com/authorize?${querystring.stringify({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scopes,
        redirect_uri: REDIRECT_URI,
    })}`;
    return authUrl;
}

async function addSpotifyTokens(user_id, service_id, tokens) {
    try {
        const { access_token, refresh_token} = tokens;
        const tokenexists = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        if (tokenexists[0].length > 0) {
            console.log('Spotify tokens already exist:', tokenexists[0]);
            const [rows] = await pool.query('UPDATE users_services_login SET connect_token = ? WHERE user_id = ? AND service_id = ?', ['{"access_token": "' + access_token + '", "refresh_token": "' + refresh_token + '"}', user_id, service_id]);
            console.log('Spotify tokens updated:', rows);
            return rows;
        } else {
            const [rows] = await pool.query('INSERT INTO users_services_login (user_id, service_id, connect_token) VALUES (?, ?, ?)', [user_id, service_id, '{"access_token": "' + access_token + '", "refresh_token": "' + refresh_token + '"}']);
            return rows;
        }
        // console.log('Spotify tokens added:', rows);
    } catch (error) {
        console.error('Error adding Spotify tokens:', error);
        throw new Error('Failed to add Spotify tokens.');
    }
}

/**
 * Checks if the number of tracks in a playlist is higher than the given number.
 * @param {string} userToken - Spotify user's access token.
 * @param {string} playlistId - The ID of the playlist to check.
 * @param {number} threshold - The number to compare against.
 * @returns {Promise<boolean>} - Returns true if the number of tracks in the playlist is greater than the threshold.
 */
async function isPlaylistTrackCountHigher(userToken, playlistId, threshold) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        const trackCount = response.data.tracks.total;
        return trackCount > threshold;
    } catch (error) {
        console.error('Error checking playlist track count:', error.response?.data || error.message);
        throw new Error('Failed to check playlist track count.');
    }
}

/**
 * Checks if a playlist ID exists for a specific user token.
 * @param {string} userToken - Spotify user's access token.
 * @param {string} playlistId - The ID of the playlist to check.
 * @returns {Promise<boolean>} - Returns true if the playlist exists; otherwise, false.
 */
async function doesPlaylistExist(userToken, playlistId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        // If the playlist is successfully fetched, it exists.
        console.log('Playlist exist');
        return true;
    } catch (error) {
        // If the error is a 404, the playlist does not exist.
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error checking playlist existence:', error.response?.data || error.message);
        throw new Error('Failed to check playlist existence.');
    }
}

/**
 * Checks if a track exists for a specific user token.
 * @param {string} userToken - Spotify user's access token.
 * @param {string} trackId - The ID of the track to check.
 * @returns {Promise<boolean>} - Returns true if the track exists; otherwise, false.
 */
async function doesTrackExist(userToken, trackId) {
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        // If the track is successfully fetched, it exists.
        console.log('Track exist');
        return true;
    } catch (error) {
        // If the error is a 404, the track does not exist.
        if (error.response?.status === 404) {
            return false;
        }
        console.error('Error checking track existence:', error.response?.data || error.message);
        throw new Error('Failed to check track existence.');
    }
}

/**
 * Checks if a specific track is currently being played on the active device.
 * @param {string} userToken - Spotify user's access token.
 * @param {string} trackId - The ID of the track to check.
 * @returns {Promise<boolean>} - Returns true if the track is currently playing; otherwise, false.
 */
async function isTrackCurrentlyPlaying(userToken, trackId) {
    const url = 'https://api.spotify.com/v1/me/player';

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        const playbackState = response.data;

        // Check if something is playing and if the track ID matches
        if (
            playbackState.is_playing &&
            playbackState.item &&
            playbackState.item.id === trackId
        ) {
            return true;
        }

        return false;
    } catch (error) {
        // Handle errors gracefully
        if (error.response?.status === 404) {
            console.error('No active device found or no playback state available.');
            return false;
        }
        console.error('Error checking playback state:', error.response?.data || error.message);
        throw new Error('Failed to check if track is currently playing.');
    }
}

/**
 * Play a specific track on the active device.
 *
 * @param {string} accessToken - The Spotify access token.
 * @param {string} trackUri - The Spotify URI of the track to play.
 * @throws Will throw an error if there is no active device or the API call fails.
 */
async function playTrackOnActiveDevice(accessToken, trackUri) {
    try {
        const response = await axios.put(
            'https://api.spotify.com/v1/me/player/play',
            {
                uris: [trackUri], // Play the specific track
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.status === 204) {
            console.log('Track is playing successfully!');
        }
    } catch (error) {
        if (error.response && error.response.status === 404) {
            console.error('No active device found. Start Spotify on a device first.');
        } else {
            console.error('Failed to play track:', error.message);
        }
    }
}

/**
 * Check if the Spotify access token is valid by calling the 'me' endpoint.
 *
 * @param {string} accessToken - The Spotify access token.
 * @returns {Promise<boolean>} - Returns true if the token is valid, false otherwise.
 */
async function isAccessTokenValid(accessToken) {
    try {
        const response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 200) {
            console.log('Access token is valid.');
            return true;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Invalid or expired access token.');
        } else {
            console.error('Error checking token validity:', error.message);
        }
        return false;
    }
}

/**
 * Refresh the access token using the refresh token.
 *
 * @param {string} refreshToken - The refresh token obtained from the initial authorization.
 * @param {string} clientId - The client ID of your Spotify app.
 * @param {string} clientSecret - The client secret of your Spotify app.
 * @returns {Promise<string>} - Returns a new access token.
 */
async function refreshAccessToken(refreshToken, clientId, clientSecret) {
    try {
        const response = await axios.post(
            'https://accounts.spotify.com/api/token',
            querystring.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
            {
                headers: {
                    Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const newAccessToken = response.data.access_token;

        console.log('New access token:', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing access token:', error.response?.data || error.message);
        throw new Error('Unable to refresh access token');
    }
}

class Spotify extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Spotify service created');
    }

    do_task(task) {
        if (task instanceof Task) {
            console.log(`Spotify service is doing task: ${task.name}`);
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return true;
    }
}

module.exports = { Spotify, getLoginLink, addSpotifyTokens, checkSpotifyActionReaction };