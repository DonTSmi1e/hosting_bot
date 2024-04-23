const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
    tid:     { type: DataTypes.STRING, allowNull: false, unique: true },
    balance: { type: DataTypes.INTEGER, allowNull: false },
    role:    { type: DataTypes.INTEGER, allowNull: false }
});

(async () => { await sequelize.sync(); })();

module.exports = User;
