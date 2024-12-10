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
            return;
        } else {
            const [rows] = await pool.query('INSERT INTO users_services_login (user_id, service_id, connect_token) VALUES (?, ?, ?)', [user_id, service_id, '{"access_token": "' + access_token + '", "refresh_token": "' + refresh_token + '"}']);
        }
        console.log('Spotify tokens added:', rows);
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

module.exports = { Spotify, getLoginLink, addSpotifyTokens };