const { Markup } = require('telegraf');

module.exports = Markup.inlineKeyboard([
    [ Markup.button.callback('Изменить баланс', 'add_money') ],
    [ Markup.button.callback('Добавить администратора', 'add_admin') ],
    [
        Markup.button.callback('Промокоды', 'promo'),
        Markup.button.callback('Создать промокод', 'add_promo'),
    ]
]);
