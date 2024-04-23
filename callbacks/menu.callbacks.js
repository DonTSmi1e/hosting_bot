const { Context } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models');

const menu_keyboard = require('../keyboards/menu.keyboards');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    let user = await User.findOne({ where: { tid: ctx.from.id } });

    if (!user) {
        user = await User.create({
            tid: ctx.from.id,
            balance: 0,
            role: ctx.from.id == settings.bot_owner ? 1 : 0
        });
    }

    await ctx.editMessageText(`Добро пожаловать, <b>${ctx.from.first_name}</b>!\nID: <code>${user.tid}</code>\nБаланс: <b>${user.balance}</b> руб.`, {
        parse_mode: 'HTML',
        ...menu_keyboard
    });
};
