const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Database = sequelize.define('Database', {
    tid:          { type: DataTypes.STRING, allowNull: false },
    host:         { type: DataTypes.STRING,  allowNull: false },
    port:         { type: DataTypes.INTEGER, allowNull: false },
    user:         { type: DataTypes.STRING,  allowNull: false },
    password:     { type: DataTypes.STRING,  allowNull: false },
    db_name:      { type: DataTypes.STRING,  allowNull: false },
    next_payment: { type: DataTypes.DATE,    allowNull: false }
});

(async () => { await sequelize.sync(); })();

module.exports = Database;
