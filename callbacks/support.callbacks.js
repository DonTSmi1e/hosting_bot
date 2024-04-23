const { Context, Markup } = require('telegraf');

const User = require('../models/user.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    let user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }

    await ctx.editMessageText(`⚫️ <b>Через тех. поддержку</b> ⚫️
<b>Ваш ID:</b> <code>${ctx.from.id}</code>

/support
Отправьте ваш ID одному из ответственных за оплату.
Ваш баланс будет полностью пополнен на желаемую сумму в течении 5-10 минут после ответа тех. поддержки.`, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [ Markup.button.callback('Назад', 'menu') ]
        ])
    });
};
