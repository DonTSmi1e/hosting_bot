const { Context } = require('telegraf');

const User = require('../models/user.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const method = ctx.match.input.split(':')[1];
    const uid = ctx.match.input.split(':')[2];
    const tag = ctx.match.input.split(':')[3];
    const admins = await User.findAll({ where: { role: 1 } });

    for (const admin of admins) {
        await ctx.sendMessage(`🚨 Пользователь @${tag} (<code>${uid}</code>) подтвердил оплату через <i>${method}</i>`, {
            chat_id: admin.tid,
            parse_mode: 'HTML'
        });
    }
};
