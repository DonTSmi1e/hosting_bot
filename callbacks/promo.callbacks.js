const { Context } = require('telegraf');

const User = require('../models/user.models');
const Promo = require('../models/promo.models');

const admin_keyboard = require('../keyboards/admin.keyboards');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user || user.role == 0) { return; }

    let message = '<b>Промокоды:</b>\n';
    const promos = await Promo.findAll();
    for (const promo of promos) {
        message += `<code>${promo.name}</code> - <b>${promo.sum}</b> руб.\n`;
    }

    await ctx.editMessageText(message, {
        parse_mode: 'HTML',
        ...admin_keyboard
    });
};
