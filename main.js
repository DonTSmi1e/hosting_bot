const { Telegraf, Scenes, session } = require('telegraf');
const cron = require('node-cron');

const settings = require('./settings.json');
const bot = new Telegraf(settings.bot_token);

const User = require('./models/user.models');
const Database = require('./models/database.models');

const accept_callback = require('./callbacks/accept.callbacks');
const buy_callback = require('./callbacks/buy.callbacks');
const database_callback = require('./callbacks/database.callbacks');
const databases_callback = require('./callbacks/databases.callbacks');
const menu_callback = require('./callbacks/menu.callbacks');
const payment_callback = require('./callbacks/payment.callbacks');
const promo_apply_callback = require('./callbacks/promo_apply.callbacks');
const promo_callback = require('./callbacks/promo.callbacks');
const renew_callback = require('./callbacks/renew.callbacks');
const reset_callback = require('./callbacks/reset.callbacks');
const sber_callback = require('./callbacks/sber.callbacks');
const tinkoff_callback = require('./callbacks/tinkoff.callbacks');
const ton_callback = require('./callbacks/ton.callbacks');
const admin_command = require('./commands/admin.commands');
const menu_command = require('./commands/menu.commands');
const support_command = require('./commands/support.commands');
const add_admin_scene = require('./scenes/add_admin.scenes');
const add_money_scene = require('./scenes/add_money.scenes');
const add_promo_scene = require('./scenes/add_promo.scenes');

bot.use(session());
bot.use((new Scenes.Stage([add_admin_scene, add_money_scene, add_promo_scene])).middleware());

bot.start(async (ctx) => { await menu_command(ctx); });
bot.help(async (ctx) => { await menu_command(ctx); });

bot.action(/^(accept:)/, async (ctx) => { await ctx.answerCbQuery(); await accept_callback(ctx); });
bot.action('buy', async (ctx) => { await ctx.answerCbQuery(); await buy_callback(ctx); });
bot.action(/^(database:)/, async (ctx) => { await ctx.answerCbQuery(); await database_callback(ctx); });
bot.action('databases', async (ctx) => { await ctx.answerCbQuery(); await databases_callback(ctx); });
bot.action('menu', async (ctx) => { await ctx.answerCbQuery(); await menu_callback(ctx); });
bot.action('payment', async (ctx) => { await ctx.answerCbQuery(); await payment_callback(ctx); });
bot.action('promo', async (ctx) => { await ctx.answerCbQuery(); await promo_callback(ctx); });
bot.action(/^(renew:)/, async (ctx) => { await ctx.answerCbQuery(); await renew_callback(ctx); });
bot.action(/^(reset:)/, async (ctx) => { await ctx.answerCbQuery(); await reset_callback(ctx); });
bot.action('sber', async (ctx) => { await ctx.answerCbQuery(); await sber_callback(ctx); });
bot.action('tinkoff', async (ctx) => { await ctx.answerCbQuery(); await tinkoff_callback(ctx); });
bot.action('ton', async (ctx) => { await ctx.answerCbQuery(); await ton_callback(ctx); });
bot.command('admin', async (ctx) => { await admin_command(ctx); });
bot.command('menu', async (ctx) => { await menu_command(ctx); });
bot.command('support', async (ctx) => { await support_command(ctx); });
bot.action('add_money', Scenes.Stage.enter('add_money'));
bot.action('add_admin', Scenes.Stage.enter('add_admin'));
bot.action('add_promo', Scenes.Stage.enter('add_promo'));
bot.on('message', async (ctx) => { await promo_apply_callback(ctx); });

async function main() {
    cron.schedule('0 0 * * *', async () => {
        const current_date = new Date();
        const databases = await Database.findAll();
        for (const database of databases) {
            const difference = parseInt((database.next_payment - current_date) / (1000 * 60 * 60 * 24));
            if (difference == 0) {
                const user = await User.findOne({ where: { tid: database.tid }});
                if (user) {
                    if (user.balance < settings.bot_price) {
                        try {
                            const db = await require('../hostDb');
                            await db.query(`ALTER USER '${database.user}'@'${database.host}' ACCOUNT LOCK;`);
                        } catch (error) {
                            console.error(error);
                        }

                        await bot.telegram.sendMessage(database.tid, `🚨 Доступ к <code>${database.id}:${database.db_name}</code> ограничен.
Пополните баланс и продлите базу данных через меню, все ваши данные будут сохранены.`, {
                            parse_mode: 'HTML'
                        });
                    } else {
                        user.balance -= settings.bot_price;
                        await user.save();

                        const next_payment = new Date();
                        next_payment.setMonth(next_payment.getMonth() + 1);
                        database.next_payment = next_payment;
                        await database.save();

                        await bot.telegram.sendMessage(database.tid, `✅ <code>${database.id}:${database.db_name}</code> продлен на еще один месяц.`, {
                            parse_mode: 'HTML'
                        });
                    }
                }
            } else
            if (difference == 1) {
                await bot.telegram.sendMessage(database.tid, `🚨 Срок аренды базы данных <code>${database.id}:${database.db_name}</code> подходит к концу.
<b>Завтра будет попытка списания средств, убедитесь что на балансе достаточно денег - в противном случае доступ к БД будет приостановлен.</b>`, {
                    parse_mode: 'HTML'
                });
            }
        }
    });

    await bot.launch();
}

main();
