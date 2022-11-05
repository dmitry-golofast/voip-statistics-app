const express = require('express');
const app = express();
const db = require('./db');
const baseRouter = require('./route');
// const TelegramBot = require('node-telegram-bot-api');
// const tokenApiTelegram = '5646820627:AAGW-QfoNjqNeyplAPh5Gqv6Uge0MozDrKQ';
// const bot = new TelegramBot(tokenApiTelegram, {polling: true});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`The server running on the port ${PORT}`));

app.use(express.json());
app.use('/api', baseRouter);

db.connect(function(err){
    if (err) {
        return console.error('Error: ' + err.message);
    } else {
        console.log('The connection to the MySQL server has been successfully established');
    }
});


// закрытие подключения
// connection.end(function(err) {
//     if (err) {
//         return console.log("Ошибка: " + err.message);
//     }
//     console.log("Подключение закрыто");
// });

//     await bot.setMyCommands([
//         {command: '/start', description: 'Start bot'},
//     ])
//     bot.on('message', async msg => {
//         let text = msg.text;
//         let chatId = msg.chat.id;
//         let last_name = msg.chat.last_name;
//         let first_name = msg.chat.first_name;
//         let username = msg.chat.username;
//
//         const sendButtons = async () => {
//             await bot.sendMessage(chatId, 'Здравствуйте. Нажмите на любую интересующую Вас кнопку.', {
//                 reply_markup: {
//                     inline_keyboard: [
//                         [{text: 'Погода в Италии', callback_data: 'WeatherItaly'}],
//                         [{text: 'Получить статистику по звонкам', callback_data: 'VoIP'}]
//                     ]
//                 }
//             })
//         }
//         if (text === '/start') {
//             await sendButtons();
//         }
//     })
// }
