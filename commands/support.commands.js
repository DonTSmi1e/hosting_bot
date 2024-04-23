const { Context } = require('telegraf');

const settings = require('../settings.json');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    await ctx.reply(`<b>Поддержка</b>
⚫️ Тех. администратор - <b>${settings.admin}</b>
🟢 Оплата Сбер - <b>${settings.sber_admin}</b>
🟡 Оплата Тинькофф - <b>${settings.tinkoff_admin}</b>
🔵 Оплата TON - <b>${settings.ton_admin}</b>
`, { parse_mode: 'HTML' });
};
