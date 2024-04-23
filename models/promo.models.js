const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Promo = sequelize.define('Promo', {
    name:        { type: DataTypes.STRING, allowNull: false },
    sum:         { type: DataTypes.INTEGER, allowNull: false }
});

(async () => { await sequelize.sync(); })();

module.exports = Promo;
