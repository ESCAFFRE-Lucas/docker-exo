const http = require('http');
const { Pool } = require('pg');

const pool = new Pool({
    host: 'db',
    user: 'user',
    password: 'password',
    database: 'mydatabase',
    port: 5432,
});

// Create table on startup
(async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
                                             id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY
        );
    `);
    console.log('Table ready');
})();

const server = http.createServer(async (req, res) => {
    try {
        // 👇 INSERT on every request
        await pool.query('INSERT INTO users DEFAULT VALUES');

        // 👇 then read everything
        const { rows } = await pool.query('SELECT * FROM users');

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(rows));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(err.message);
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});
