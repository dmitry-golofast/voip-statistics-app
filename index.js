const express = require('express');
const axios = require('axios');
const app = express();
const db = require('./db');
const baseRouter = require('./route');
const TelegramBot = require('node-telegram-bot-api');
const tokenApiTelegram = require('./telegram-token');
const bot = new TelegramBot(tokenApiTelegram, {polling: true});
const tokenApiWeather = require('./weather-api-token')

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

function getStringDate() {
    let
        now = new Date();
        year = now.getFullYear(),
        month = now.getMonth(),
        day = now.getDate()

    month = (month < 10) ? '0' + (month + 1) : month + 1;
    day = (day < 10) ? '0' + day : day;
    return year + '-' + month + '-' + day;
}

async function startFeatureBot() {
    await bot.setMyCommands([
        {command: '/start', description: 'Start bot'},
    ])
    bot.on('message', async msg => {
        let text = msg.text;
        let chatId = msg.chat.id;
        let first_name = msg.chat.first_name;

        const sendButtons = async () => {
            if (first_name) {
                await bot.sendMessage(chatId, `Здравствуйте ${first_name}. Нажмите на любую интересующую Вас кнопку.`, {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Погода в Милане', callback_data: 'WeatherItaly'}],
                            [{text: 'Получить данные по звонкам за сегодня', callback_data: 'CallsDay'}]
                        ]
                    }
                })
            } else {
                await bot.sendMessage(chatId, 'Inter you name in telegram')
            }
        }
        if (text === '/start') {
            await sendButtons();
        }
    })

    const mainApp = async () => {
        bot.on('callback_query', async msg => {
            const weatherHtmlTemplate = (name, main, weather, wind, clouds) => (`
The weather in <b>${name}</b>:
<b>${weather.main}</b> - ${weather.description}
Temperature: <b>${main.temp} °C</b>
Pressure: <b>${main.pressure} hPa</b>
Humidity: <b>${main.humidity} %</b>
Wind: <b>${wind.speed} meter/sec</b>
Clouds: <b>${clouds.all} %</b>
`);
            const data = msg.data;
            const chatId = msg.message.chat.id;
            if (data === 'WeatherItaly') {
                const codeCity = 3173435;
                const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?id=${codeCity}&units=metric&appid=${tokenApiWeather}`;
                const cityWeather = () => {
                    axios.get(weatherUrl).then((resp) => {
                        const {
                            name,
                            main,
                            weather,
                            wind,
                            clouds
                        } = resp.data;
                        return bot.sendMessage(chatId, weatherHtmlTemplate(name, main, weather[0], wind, clouds), {
                            parse_mode: 'HTML'
                        })
                    }).catch(function (error) {
                        console.log(error);
                        return bot.sendMessage(chatId, 'BOT can not get data from the server');
                    });
                }
                cityWeather();
            }
            if (data === 'CallsDay') {
                await bot.sendMessage(chatId, 'Выберите интересующий вас пункт меню', {
                    reply_markup: {
                        inline_keyboard: [
                            [{text: 'Количесво исходищих звонков', callback_data: 'OutGoingCalls'}],
                            [{text: 'Количество входящих звонков', callback_data: 'InComeCalls'}],
                            [{text: 'Минуты на исходящие', callback_data: 'OutMinCalls'}],
                            [{text: 'Минуты на входящие', callback_data: 'InMinCalls'}]
                        ]
                    }
                })
            }
            if (data === 'OutGoingCalls') {
                async function getCallsDay() {
                    const today = getStringDate();
                    await fetch(`http://localhost:8082/api/callsday/${today}/`)
                        .then(response => response.json())
                        .then((data) => {
                            bot.sendMessage(chatId, `Сегодня зафиксированно ${data} исх. звонков`)
                        });
                }
                await getCallsDay()
            }
            if (data === 'InComeCalls') {
                async function getInCallsDay() {
                    const today = getStringDate();
                    await fetch(`http://localhost:8082/api/incallsday/${today}/`)
                        .then(response => response.json())
                        .then((data) => {
                            bot.sendMessage(chatId, `Сегодня зафиксированно ${data} вх. звонка`)
                        });
                }
                await getInCallsDay()
            }
            if (data === 'OutMinCalls') {
                async function getOutMinDay() {
                    const today = getStringDate();
                    await fetch(`http://localhost:8082/api/outminday/${today}/`)
                        .then(response => response.json())
                        .then((data) => {
                            bot.sendMessage(chatId, `Сегодня сотрудники ${data} минут звонили из салона`)
                        });
                }
                await getOutMinDay()
            }
            if (data === 'InMinCalls') {
                async function getInMinDay() {
                    const today = getStringDate();
                    await fetch(`http://localhost:8082/api/inminday/${today}/`)
                        .then(response => response.json())
                        .then((data) => {
                            bot.sendMessage(chatId, `Сегодня клиенты были на вх.линии ${data} минут`)
                        });
                }
                await getInMinDay()
            }

        })
    }
    await mainApp();
}
startFeatureBot();