const { Context } = require('telegraf');

const User = require('../models/user.models');
const Promo = require('../models/promo.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user || user.role == 0) { return; }

    const promo = await Promo.findOne({ where: { name: ctx.message.text } });
    if (promo) {
        user.balance += parseInt(promo.sum);
        await user.save();
        await promo.destroy();
        await ctx.reply('Промокод активирован, баланс пополнен.');
    } else {
        await ctx.reply('Промокод не существует, или был активирован ранее.');
    }
};
