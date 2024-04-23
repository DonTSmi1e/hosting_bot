const { Sequelize } = require('sequelize');

const settings = require('./settings.json');
const sequelize = new Sequelize(settings.bot_db);

(async () => { await sequelize.authenticate(); })();

module.exports = sequelize;
