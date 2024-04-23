const { Scenes } = require('telegraf');

const User = require('../models/user.models')
const Promo = require('../models/promo.models')

const admin_keyboard = require('../keyboards/admin.keyboards');

module.exports = new Scenes.WizardScene(
    'add_promo',
    async (ctx) => {
        await ctx.answerCbQuery();

        const user = await User.findOne({ where: { tid: ctx.from.id } });
        if (!user || user.role == 0) { return ctx.scene.leave(); }

        await ctx.editMessageText('Введите название промокода');
        return ctx.wizard.next();
    },
    async (ctx) => {
        ctx.wizard.state.name = ctx.message.text;

        await ctx.reply('Введите сумму промокода');
        return ctx.wizard.next();
    },
    async (ctx) => {
        if (isNaN(ctx.message.text)) {
            await ctx.reply('Неверное число', admin_keyboard);
            return ctx.scene.leave();
        }

        ctx.wizard.state.sum = parseInt(ctx.message.text);

        await Promo.create({
            name: ctx.wizard.state.name,
            sum: ctx.wizard.state.sum
        });

        await ctx.reply(`Промокод <code>${ctx.wizard.state.name}</code> создан.`, { parse_mode: 'HTML', ...admin_keyboard });
        return ctx.scene.leave();
    }
);
