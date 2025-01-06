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
        console.log("VHZECDSJHCSJHDCQSCBJHUJKEFVV")
        console.log('params: ', params["Playlist Uri"]);
        console.log('service id: ', service_id);
        const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        console.log('tokens: ', user_tokens[0].connect_token);
        const access_token = user_tokens[0].connect_token["access_token"];
        console.log('access_token: ', access_token);
        if (!await isAccessTokenValid(access_token)) {
            const refresh_token = user_tokens[0].connect_token["refresh_token"];
            const access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
            user_tokens[0].connect_token["access_token"] = access_token;
            console.log(user_tokens[0].connect_token);
            await pool.query(
                `UPDATE users_services_login
                 SET connect_token = JSON_SET(connect_token, '$."access_token"', ?, '$."refresh_token"', ?)
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
        // console.log('params: ', params["Track Uri"]);
        // console.log('service id: ', service_id);
        const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        // console.log('tokens: ', user_tokens[0].connect_token);
        const access_token = user_tokens[0].connect_token["access_token"];
        // console.log('access_token: ', access_token);
        if (!await isAccessTokenValid(access_token)) {
            const refresh_token = user_tokens[0].connect_token["refresh_token"];
            const access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
            user_tokens[0].connect_token["access_token"] = access_token;
            console.log(user_tokens[0].connect_token);
            await pool.query(
                `UPDATE users_services_login
                 SET connect_token = JSON_SET(connect_token, '$."access_token"', ?, '$."refresh_token"', ?)
                 WHERE user_id = ? AND service_id = ?`,
                [access_token, refresh_token, user_id, service_id]
            );
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
 * Check if the params for the action that is triggered when a track is played
 *
 * @param {JSON} params - The parameters of the action
 * @param {string} user_id - The id of the user
 * @param {string} service_id - The id of the service
 * @returns {boolean} - Return true if the params are good for this actions
 */
async function checkATrackHasBeenPlayed(params, user_id, service_id) {
    try {
        // console.log('params: ', params["Track Uri"]);
        // console.log('service id: ', service_id);
        console.log("PARAM :", params);
        const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
        console.log('tokens: ', user_tokens);
        const access_token = user_tokens[0].connect_token["access_token"];
        // console.log('access_token: ', access_token);
        if (!await isAccessTokenValid(access_token)) {
            console.log("IN CONDITION ACCESS TOKEN VALID");
            const refresh_token = user_tokens[0].connect_token["refresh_token"];
            const access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
            user_tokens[0].connect_token["access_token"] = access_token;
            console.log(user_tokens[0].connect_token);
            await pool.query(
                `UPDATE users_services_login
                 SET connect_token = JSON_SET(connect_token, '$."access_token"', ?, '$."refresh_token"', ?)
                 WHERE user_id = ? AND service_id = ?`,
                [access_token, refresh_token, user_id, service_id]
            );
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
            case 'Play a track':
                return await checkPlayATrack(params, user_id, service_id);
            case 'A track is played':
                return await checkATrackHasBeenPlayed(params, user_id, service_id);
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
 * Return the number of track in a playlist.
 * @param {string} playlistId - The ID of the playlist to check.
 * @returns {number} - Return the number of track in a playlist.
 */
async function getTrackSize(userToken, playlistId) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${userToken}`,
            },
        });

        return response.data.tracks.total;
    } catch (error) {
        console.error('Error checking playlist track count:', error.response?.data || error.message);
        throw new Error('Failed to check playlist track count.');
    }
}

/**
 * Checks if the number of tracks in a playlist is higher than the given number.
 * @param {string} userToken - Spotify user's access_token.
 * @param {string} playlistId - The ID of the playlist to check.
 * @param {number} threshold - The number to compare against.
 * @returns {Promise<boolean>} - Returns true if the number of tracks in the playlist is greater than the threshold.
 */
async function isPlaylistTrackCountHigher(userToken, playlistId, threshold) {
    const url = `https://api.spotify.com/v1/playlists/${playlistId}`;

    try {
        const trackCount = await getTrackSize(userToken, playlistId);
        console.log('Treshold:', threshold);
        console.log('Track count:', trackCount);
        if (trackCount != threshold) {

            if (trackCount > threshold) {
                console.log('Playlist track count is higher than the threshold.');
                return true;
            }
        }
        console.log('Playlist track count is lower or equal than the threshold.');
        return false;
    } catch (error) {
        console.error('Error checking playlist track count:', error.response?.data || error.message);
        throw new Error('Failed to check playlist track count.');
    }
}

/**
 * Checks if a playlist ID exists for a specific user token.
 * @param {string} userToken - Spotify user's access_token.
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
 * @param {string} userToken - Spotify user's access_token.
 * @param {string} trackId - The ID of the track to check.
 * @returns {Promise<boolean>} - Returns true if the track exists; otherwise, false.
 */
async function doesTrackExist(userToken, trackId) {
    const url = `https://api.spotify.com/v1/tracks/${trackId}`;

    try {
        console.log('Checking track existence for track ID:', trackId);
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
 * @param {string} userToken - Spotify user's access_token.
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
 * @param {string} accessToken - The Spotify access_token.
 * @param {string} trackUri - The Spotify URI of the track to play.
 * @throws Will throw an error if there is no active device or the API call fails.
 */
async function playTrackOnActiveDevice(accessToken, trackId) {
    const trackUri = `spotify:track:${trackId}`;
    console.log('Playing track:', trackUri);
    try {
        const response = await axios.put(
            'https://api.spotify.com/v1/me/player/play',
            {
                uris: [trackUri],
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

        if (error.response) {
            if (error.response.status === 400) {
                console.error('Bad request. Ensure the track URI is valid and the token has the correct scopes.');
            } else if (error.response.status === 404) {
                console.error('No active device found. Start Spotify on a device first.');
            } else if (error.response.status === 401) {
                console.error('access_token expired or invalid. Refresh the token.');
            } else {
                console.error('Spotify API error:', error.response.status, error.response.data);
            }
        } else {
            console.error('Failed to play track:', error.message);
        }
    }
}

/**
 * Check if the Spotify access_token is valid by calling the 'me' endpoint.
 *
 * @param {string} accessToken - The Spotify access_token.
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
            console.log('access_token is valid.');
            return true;
        } else {
            return false;
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('Invalid or expired access_token.');
        } else {
            console.error('Error checking token validity:', error.message);
        }
        return false;
    }
    return false;
}

/**
 * Refresh the access_token using the refresh_token.
 *
 * @param {string} refreshToken - The refresh_token obtained from the initial authorization.
 * @param {string} clientId - The client ID of your Spotify app.
 * @param {string} clientSecret - The client secret of your Spotify app.
 * @returns {Promise<string>} - Returns a new access_token.
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

        console.log('New access_token:', newAccessToken);
        return newAccessToken;
    } catch (error) {
        console.error('Error refreshing access_token:', error.response?.data || error.message);
        throw new Error('Unable to refresh access_token');
    }
}

/**
 * Create the json for the action "A Track is added to a playlist".
 *
 * @param {string} access_token - The token used to communicate with the spotify api.
 * @param {string} playlist_uri - The Uri of the spotify playlist
 * @returns {JSON} - The JSON for the action "A Track is added to a playlist".
 */
async function create_json_action_a_track_is_added_to_playlist(access_token, playlist_uri, request_json) {
    const nb_musics = await getTrackSize(access_token, playlist_uri);
    console.log('Nb musics: ', nb_musics);
    request_json.params["nb_musics"] = nb_musics;
    console.log(request_json);
    return request_json;
}

/**
 * Create the json for the reaction "Play a track".
 *
 * @param {string} access_token - The token used to communicate with the spotify api.
 * @param {string} track_uri - The Uri of the spotify track
 * @returns {JSON} - The JSON for the action "Play a track".
 */
async function create_json_action_play_a_track(access_token, track_uri, request_json) {
    if (!await doesTrackExist(access_token, track_uri)) {
        return undefined;
    }
    return request_json;
}

/**
 * Create the json for the reaction "A song is played".
 *
 * @param {string} access_token - The token used to communicate with the spotify api.
 * @param {string} track_uri - The Uri of the spotify track
 * @returns {JSON} - The JSON for the action "A song is played".
 */
async function create_json_action_a_song_is_played(access_token, track_uri, request_json) {
    if (!await doesTrackExist(access_token, track_uri)) {
        return undefined;
    }
    return request_json;
}


/**
 * Create the json for the SPotify actions and reactions.
 *
 * @param {JSON} request_json - The json send in the request.
 * @param {string} target_name - The name of the action/reaction.
 * @returns {Promise<string>} - Returns the json for the database.
 */
async function create_json(request_json, target_name, user_id, service_id) {
    console.log('user_id:', user_id);
    console.log('service_id:', service_id);
    const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id]);
    access_token = user_tokens[0].connect_token["access_token"]
    if (!await isAccessTokenValid(access_token)) {
        const refresh_token = user_tokens[0].connect_token["refresh_token"];
        access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
        user_tokens[0].connect_token["access_token"] = access_token;
        await pool.query(
            `UPDATE users_services_login
            SET connect_token = JSON_SET(connect_token, '$."access_token"', ?, '$."refresh_token"', ?)
            WHERE user_id = ? AND service_id = ?`,
            [access_token, refresh_token, user_id, service_id]
        );
    }
    try {
        console.log('Creating json for:\"', target_name, '\"');
        switch (target_name) {
            //actions
            case 'A song is played': {
                console.log(request_json);
                const track_uri = request_json.params["Track Uri"];
                console.log('Track Uri: ', track_uri);
                return await create_json_action_a_song_is_played(access_token, track_uri, request_json);
                break;
            }

            case 'A track is added to a playlist': {
                console.log(request_json);
                const playlistUri = request_json.params["Playlist Uri"];
                console.log('Playlist Uri: ', playlistUri);
                return await create_json_action_a_track_is_added_to_playlist(access_token, playlistUri, request_json);
                break;
            }

            //reactions
            case 'Play a track': {
                console.log(request_json);
                const track_uri = request_json.params["Track Uri"];
                console.log('Track Uri: ', track_uri);
                return await create_json_action_play_a_track(access_token, track_uri, request_json);
                break;
            }

            default: {
                throw new Error('Action/Reaction not supported');
            }
        }
    } catch (error) {
        console.error('Error creating json:', error);
    }
}

class Spotify extends AbstractService {
    constructor(id, name) {
        super(id, name);
        console.log('Spotify service created');
    }

    async do_task(task, action_reaction_id) {
        let value = false;
        if (task instanceof Task) {
            console.log(`Spotify service is doing task: ${task.name}`);
            const user_id = task.id;
            const [service_id] = await pool.query('SELECT id FROM services WHERE name = ?', "Spotify");
            console.log('service id: ', service_id[0].id);
            const [user_tokens] = await pool.query('SELECT * FROM users_services_login WHERE user_id = ? AND service_id = ?', [user_id, service_id[0].id]);
            console.log('tokens: ', user_tokens[0].connect_token);
            const access_token = user_tokens[0].connect_token["access_token"];

            if (!await isAccessTokenValid(access_token)) {
                const refresh_token = user_tokens[0].connect_token["refresh_token"];
                const access_token = await refreshAccessToken(refresh_token, CLIENT_ID, CLIENT_SECRET);
                user_tokens[0].connect_token["access_token"] = access_token;
                await pool.query(
                    `UPDATE users_services_login
                    SET connect_token = JSON_SET(connect_token, '$."access_token"', ?, '$."refresh_token"', ?)
                    WHERE user_id = ? AND service_id = ?`,
                    [access_token, refresh_token, user_id, service_id[0].id]
                );
            }

            switch (task.name) {

                //Actions
                case 'A track is added to a playlist': {
                    console.log('Doing task: A track is added to a playlist');
                    const playlistUri = task.params["Playlist Uri"];
                    console.log('playlist uri: ', playlistUri);
                    const nb_tracks = task.params["nb_musics"];
                    if (await isPlaylistTrackCountHigher(access_token, playlistUri, nb_tracks)) {
                        console.log('A track has been add to the playlist');
                        value = true;
                    }
                    const new_nb_tracks = await getTrackSize(access_token, playlistUri);
                    if (new_nb_tracks != nb_tracks) {
                        const [action_reaction] = await pool.query('SELECT * FROM action_reaction WHERE id = ?', action_reaction_id);
                        console.log('action_reaction:', action_reaction[0]);
                        let action = action_reaction[0].action;
                        let params = action.params;
                        console.log('params:', params);
                        params["nb_musics"] = new_nb_tracks;
                        console.log('new params:', params);
                        action.params = params;
                        console.log('new action:', action);
                        await pool.query('UPDATE action_reaction SET action = ? WHERE id = ?', [JSON.stringify(action), action_reaction_id]);
                    }
                    break;
                }

                case 'A song is played': {
                    console.log('Doing task: A song is played');
                    const trackUri = task.params["Track Uri"];
                    console.log('Track Uri: ', trackUri);
                    const nb_tracks = task.params["nb_music"];
                    if (await isTrackCurrentlyPlaying(access_token, trackUri)) {
                        console.log('Track is played');
                        value = true;
                    }
                    break;
                }

                //Reactions
                case 'Play a track': {
                    console.log('Doing task: Play a track');
                    // console.log('params: ', task.params);
                    const trackUri = task.params["Track Uri"];
                    console.log('track uri: ', trackUri);
                    await playTrackOnActiveDevice(access_token, trackUri);
                    break;
                }
            }
        } else {
            throw new Error('Task must be an instance of Task');
        }
        return value;
    }
}

module.exports = { Spotify, getLoginLink, addSpotifyTokens, checkSpotifyActionReaction, create_json };