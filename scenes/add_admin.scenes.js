const { Scenes } = require('telegraf');

const settings = require('../settings.json');
const User = require('../models/user.models')

const admin_keyboard = require('../keyboards/admin.keyboards');

module.exports = new Scenes.WizardScene(
    'add_admin',
    async (ctx) => {
        await ctx.answerCbQuery();

        const user = await User.findOne({ where: { tid: ctx.from.id } });
        if (!user || user.role == 0) { return ctx.scene.leave(); }

        await ctx.editMessageText('Введите ID пользователя');
        return ctx.wizard.next();
    },
    async (ctx) => {
        const user = await User.findOne({ where: { tid: ctx.message.text } });
        if (!user) {
            await ctx.reply('Пользователь не найден', admin_keyboard);
            return ctx.scene.leave();
        } else
        if (user.tid == ctx.from.id || user.tid == settings.bot_owner) {
            await ctx.reply('хдхдхд', admin_keyboard);
            return ctx.scene.leave();
        }

        user.role = !user.role;
        await user.save();

        await ctx.reply('Готово', admin_keyboard);
        return ctx.scene.leave();
    }
);
