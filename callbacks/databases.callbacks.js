const { Context, Markup } = require('telegraf');

const User = require('../models/user.models');
const Database = require('../models/database.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }

    let keyboard = [];
    const databases = await Database.findAll({ where: { tid: ctx.from.id }});
    for (const database of databases) {
        keyboard.push([ Markup.button.callback(`#${database.id}, ${database.db_name}`, `database:${database.id}`) ]);
    }
    keyboard.push([ Markup.button.callback('Назад', 'menu') ]);

    await ctx.editMessageText('Ваши базы данных', Markup.inlineKeyboard(keyboard));
};
