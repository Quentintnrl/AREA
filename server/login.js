const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function register(email, username, password, pool) {
    const [existingEmailUsers] = await pool.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
    );

    const [existingNameUsers] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    );

    if (existingEmailUsers.length > 0) {
        throw new Error('UserEmail already exists');
    }
    if (existingNameUsers.length > 0) {
        throw new Error('UserName already exists');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await pool.execute(
        'INSERT INTO users (email, username, client_password) VALUES (?, ?, ?)',
        [email, username, hashedPassword]
    );

    const token = jwt.sign(
        { userId: result.insertId, username },
        'your-secret-key',
        { expiresIn: '24h' }
    );

    return {
        token,
        Id: result.insertId,
        userName: username
    };
}

async function login(userId, password, pool) {
    let [users] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [userId]
    );

    if (users.length === 0) {
        [users] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [userId]
        );
        if (users.length === 0) {
            throw new Error('Invalid userName or email');
        }
    }

    const user = users[0];
    if (!password || !user.client_password) {
        throw new Error('Password required');
    }
    const validPassword = await bcrypt.compare(password, user.client_password);

    if (!validPassword) {
        throw new Error('Invalid password');
    }

    const token = jwt.sign(
        { Id: user.id, userName: user.username },
        'your-secret-key',
        { expiresIn: '1h' }
    );

    return {
        token,
        Id: user.id,
        userName: user.username
    };
}

module.exports = { register, login };
