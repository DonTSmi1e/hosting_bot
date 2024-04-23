const { Context, Markup } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    let user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }

    await ctx.editMessageText(`🟡 <b>Тинькофф</b> 🟡
<b>Номер карты:</b> <code>${settings.tinkoff}</code>
<b>Ваш ID:</b> <code>${ctx.from.id}</code>

Отправьте желаемую сумму на указанный номер.
<b>Обязательно укажите ваш ID в сообщении к платежу.</b>
Ваш баланс будет полностью пополнен на полученную сумму в течении 8 часов.
В случае возникших проблем, немедленно обратитесь в /support

После произведенной оплаты нажмите кнопку <b>Подтвердить платеж</b> чтобы уведомить администраторов.`, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [ Markup.button.callback('Подтвердить платеж', `accept:tinkoff:${ctx.from.id}:${ctx.from.username}`) ],
            [ Markup.button.callback('Назад', 'menu') ]
        ])
    });
};
