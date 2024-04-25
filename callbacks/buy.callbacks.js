const { Context, Markup } = require('telegraf');
const generator = require('generate-password');

const settings = require('../settings.json');
const User = require('../models/user.models');
const Database = require('../models/database.models');

const menu_keyboard = require('../keyboards/menu.keyboards');

/**
 * @param { Context } ctx 
 */
module.exports = async (ctx) => {
    const user = await User.findOne({ where: { tid: ctx.from.id } });
    if (!user) { return; }
    if (user.balance < settings.bot_price) {
        await ctx.editMessageText(`Стоимость базы данных: <b>${settings.bot_price}</b> руб./месяц.
У вас не хватает <b>${settings.bot_price - user.balance}</b> руб.`, {
            parse_mode: 'HTML',
            ...Markup.inlineKeyboard([[ Markup.button.callback('Назад', 'menu') ]])
        });
        return;
    }

    try {
        const db = await require('../hostDb');
        const username = `${ctx.from.id}_${generator.generate({ length: 5 })}`;
        const password = generator.generate({ length: 10, numbers: true });
        const db_name = `${ctx.from.id}_${generator.generate({ length: 8 })}`;

        await db.query(`CREATE DATABASE ${db_name}`);
        await db.query(`CREATE USER '${username}'@'%' IDENTIFIED BY '${password}';`);
        await db.query(`GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON ${db_name}.* TO '${username}'@'%';`);

        const next_payment = new Date();
        next_payment.setMonth(next_payment.getMonth() + 1);

        await Database.create({
            tid: ctx.from.id,
            host: settings.db_host,
            port: settings.db_port,
            user: username,
            password: password,
            db_name: db_name,
            next_payment: next_payment
        });

        user.balance -= settings.bot_price;
        await user.save();

        await ctx.editMessageText(`Спасибо что доверяете нам ❤️
IP: <code>${settings.db_host}</code>
Порт: <code>${settings.db_port}</code>
Имя пользователя: <code>${username}</code>
Пароль: <code>${password}</code>
Название БД: <code>${db_name}</code>`, {
            parse_mode: 'HTML',
            ...menu_keyboard
        });
    } catch (error) {
        console.error(error);
        await ctx.reply('Произошла критическая ошибка. Вы ни в чем не виноваты. /support');
    }
};
