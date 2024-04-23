const mysql = require('mysql2/promise');
const settings = require('./settings.json');

module.exports = (async () => {
    const connection = await mysql.createConnection({
        host: settings.db_host,
        user: settings.db_user,
        password: settings.db_pass
    });

    return connection;
})();
