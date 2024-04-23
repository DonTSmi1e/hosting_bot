const { Context, Markup } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    let user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }

    let keyboard = [];
    if (settings.sber)    { keyboard.push([ Markup.button.callback('🟢 Сбербанк (по номеру карты)', 'sber') ]); }
    if (settings.tinkoff) { keyboard.push([ Markup.button.callback('🟡 Тинькофф (по номеру карты)', 'tinkoff') ]); }
    if (settings.ton)     { keyboard.push([ Markup.button.callback('🔵 TON', 'ton') ]); }
    keyboard.push([ Markup.button.callback('Назад', 'menu') ]);

    await ctx.editMessageText('Выберите способ оплаты', Markup.inlineKeyboard(keyboard));
};
