const { Context } = require('telegraf');

const User = require('../models/user.models')

const admin_keyboard = require('../keyboards/admin.keyboards')

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const user = await User.findOne({ where: { tid: ctx.from.id } });

    if (user && user.role > 0) {
        await ctx.reply('Панель администратора', admin_keyboard);
    }
};
