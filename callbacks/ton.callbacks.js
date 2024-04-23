const { Context, Markup } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    let user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }

    await ctx.editMessageText(`🔵 <b>TON</b> 🔵
<b>Адрес TON:</b> <code>${settings.ton}</code>
<b>Ваш ID:</b> <code>${ctx.from.id}</code>

Отправьте желаемую сумму на указанный адрес.
Ваш баланс будет полностью пополнен на полученную сумму в рублях при конвертации в течении 8 часов.
<b>После оплаты сообщите свой ID и сумму перевода</b> @Lokotsl <b>или</b> @povorozniuk_anton
В случае возникших проблем, немедленно обратитесь в /support

После произведенной оплаты нажмите кнопку <b>Подтвердить платеж</b> чтобы уведомить администраторов.`, {
        parse_mode: 'HTML',
        ...Markup.inlineKeyboard([
            [ Markup.button.callback('Подтвердить платеж', `accept:ton:${ctx.from.id}:${ctx.from.username}`) ],
            [ Markup.button.callback('Назад', 'menu') ]
        ])
    });
};
