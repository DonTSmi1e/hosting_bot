const { Scenes } = require('telegraf');

const User = require('../models/user.models')

const admin_keyboard = require('../keyboards/admin.keyboards');

module.exports = new Scenes.WizardScene(
    'add_money',
    async (ctx) => {
        await ctx.answerCbQuery();

        const user = await User.findOne({ where: { tid: ctx.from.id } });
        if (!user || user.role == 0) { return ctx.scene.leave(); }

        await ctx.editMessageText('Введите ID пользователя');
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.wizard.state.user = await User.findOne({ where: { tid: ctx.message.text } });
        if (!ctx.wizard.state.user) {
            await ctx.reply('Пользователь не найден', admin_keyboard);
            return ctx.scene.leave();
        }

        await ctx.reply('Сколько необходимо добавить на баланс?');
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (isNaN(ctx.message.text)) {
            await ctx.reply('Неверное число', admin_keyboard);
            return ctx.scene.leave();
        }

        ctx.wizard.state.user.balance += parseInt(ctx.message.text);
        await ctx.wizard.state.user.save();

        await ctx.sendMessage(`💰 Администратор пополнил ваш баланс на ${ctx.message.text} рублей.`, {
            chat_id: ctx.wizard.state.user.tid
        });

        await ctx.reply('Готово', admin_keyboard);
        return ctx.scene.leave();
    }
);
