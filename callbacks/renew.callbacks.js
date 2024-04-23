const { Context, Markup } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models');
const Database = require('../models/database.models');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const id = parseInt(ctx.match.input.split(':')[1]);

    const user = await User.findOne({ where: { tid: ctx.from.id } });
    const database = await Database.findOne({ where: { id: id, tid: ctx.from.id }});
    if (!user || !database) { return; }

    if (user.balance >= settings.bot_price) {
        try {
            user.balance -= settings.bot_price;
            await user.save();

            const db = await require('../hostDb');
            await db.query(`ALTER USER '${database.user}'@'${database.host}' ACCOUNT UNLOCK;`);
    
            const next_payment = new Date(database.next_payment);
            next_payment.setMonth(next_payment.getMonth() + 1);
            database.next_payment = next_payment;
            await database.save();

            await ctx.editMessageText(`<b>Продлен до ${database.next_payment.toISOString().replace(/T/, ' ').replace(/\..+/, '')}</b>

IP: <code>${database.host}</code>
Порт: <code>${database.port}</code>
Имя пользователя: <code>${database.user}</code>
Пароль: <code>${database.password}</code>
Название БД: <code>${database.db_name}</code>`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([
                [ Markup.button.callback('Сбросить пароль', `reset:${database.id}`) ],
                [ Markup.button.callback('Продлить', `renew:${database.id}`) ],
                [ Markup.button.callback('Назад', 'menu') ]
            ])});
        } catch (error) {
            console.error(error);
            await ctx.reply('Произошла критическая ошибка. Вы ни в чем не виноваты. /support');
        }
    } else {
        await ctx.editMessageText('Недостаточно средств', Markup.inlineKeyboard([
            [ Markup.button.callback('Сбросить пароль', `reset:${database.id}`) ],
            [ Markup.button.callback('Продлить', `renew:${database.id}`) ],
            [ Markup.button.callback('Назад', 'menu') ]
        ]));
    }
};
