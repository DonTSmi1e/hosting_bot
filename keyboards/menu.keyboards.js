const { Markup } = require('telegraf');

module.exports = Markup.inlineKeyboard([
    [ Markup.button.callback('Пополнить баланс', 'payment') ],
    [
        Markup.button.callback('Создать БД', 'buy'),
        Markup.button.callback('Ваши БД', 'databases')
    ]
]);
