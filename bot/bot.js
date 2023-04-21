// const TelegramBot = require('node-telegram-bot-api');
import TelegramBot from 'node-telegram-bot-api';
import {timeoutFetch} from "../utils/FatchUtils.js";
import util from "util";
import BigNumber from 'bignumber.js'

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.NODE_ENV === 'prod' ? '6237078898:AAGbtiaaa2j65ntR8ft6e00wrk0GTx6_Xo4' : '5989728913:AAH9nq1jCSGmFt6uOZ5fzOUSIA0NmEDBimU';

const wallet_url = 'https://tg.crescentbase.com/index.html';

const settings_url = 'https://tg.crescentbase.com/index.html?type=setting';

const delete_wallet_url = 'https://tg.crescentbase.com/index.html?type=delete';

const deposits_url = 'https://global.transak.com/?apiKey=2bd8015d-d8e6-4972-bcca-22770dcbe595';

const support_url = 'https://t.me/CrescentSupportService';


export function loadBot() {
    // Create a bot that uses 'polling' to fetch new updates
    const bot = new TelegramBot(token, {polling: true});

    bot.onText(/\/start/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        console.log("onText msg", msg);
        const chatId = msg.chat.id;

        //menu_button: JSON.stringify({ type: 'web_app', text: 'Hello', web_app: { url: 'https://webappcontent.telegram.org/cafe' } }),
        bot.setChatMenuButton({
            chat_id: chatId,
            menu_button: JSON.stringify({ type: 'commands', text: 'Crescent' })
        }).then(result => {
            console.log("/start", result);
        });
    });

// Matches "/echo [whatever]"
    bot.onText(/\/menu/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        console.log("onText msg", msg);
        const chatId = msg.chat.id;
        const isZh = msg.from.language_code === 'zh-hans';
        // const resp = match[1]; // the captured "whatever"

        const options = {
            parse_mode: "HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: isZh ? '我的钱包' : "My Wallet", callback_data: 'show_wallet' }, { text: isZh ? '法币入金' : "Flat Deposits", web_app: { url: deposits_url}} ],
                    [{ text: isZh ? '客服' : "Support", url: support_url }, { text: isZh ? '设置' : "Settings", web_app: { url: settings_url }} ],
                    [{ text: isZh ? '打开钱包' : "Open Wallet", web_app: { url: wallet_url }} ]
                ]
            })
        };
        //isZh ? `<a href=\'https://crescentbase.com\'>Crescent钱包</a>是一款支持ERP4337标准，免私钥助记词的智能合约钱包。除发送、接收、法币入金外、还支持邮箱绑定。` : `<a href='https://crescentbase.com'>Crescent Wallet</a> is a keyless, smart contract wallet that supports the ERP4337 standard. In addition to sending, receiving, fiat deposits, it also supports email binding.`
        bot.sendMessage(chatId, 'Your next-gen TG wallet', options);
    });


    bot.onText(/\/settings/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        // console.log("onText msg", msg);
        const chatId = msg.chat.id;
        const isZh = msg.from.language_code === 'zh-hans';
        // const resp = match[1]; // the captured "whatever"

        const options = {
            parse_mode: "HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [{ text: isZh ? '设置' : "Settings", web_app: { url: settings_url }} ]
                ]
            })
        };
        bot.sendMessage(chatId, isZh ? `设置` : `Settings`, options);
    });

    bot.onText(/\/deposit/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        // console.log("onText msg", msg);
        const chatId = msg.chat.id;
        const isZh = msg.from.language_code === 'zh-hans';
        // const resp = match[1]; // the captured "whatever"

        const options = {
            parse_mode: "HTML",
            reply_markup: JSON.stringify({
                inline_keyboard: [
                    [ { text: isZh ? '法币入金' : "Flat Deposits", web_app: { url: deposits_url}} ]
                ]
            })
        };
        bot.sendMessage(chatId, isZh ? '法币入金' : "Flat Deposits", options);
    });

    bot.on('callback_query', function onCallbackQuery(callbackQuery) {
        const action = callbackQuery.data;
        const msg = callbackQuery.message;
        const isZh = callbackQuery.from.language_code === 'zh-hans';
        let name = `${msg.chat.first_name}`;
        if (msg.chat.last_name) {
            name = `${name} ${msg.chat.last_name}`;
        }
        console.log("callbackQuery", callbackQuery);
        if (action === 'show_wallet') {
            showWallet(bot, msg.chat.id, name, isZh).then(result => {
                bot.answerCallbackQuery(callbackQuery.id);
            });
            return;
        }
        bot.answerCallbackQuery(callbackQuery.id);
    });

    bot.onText(/\/wallet/, (msg, match) => {
        // 'msg' is the received Message from Telegram
        // 'match' is the result of executing the regexp above on the text content
        // of the message

        // console.log("onText msg", msg);
        const chatId = msg.chat.id;
        const isZh = msg.from.language_code === 'zh-hans';
        let name = `${msg.chat.first_name}`;
        if (msg.chat.last_name) {
            name = `${name} ${msg.chat.last_name}`;
        }
        // const resp = match[1]; // the captured "whatever"
        console.log("wallet", msg);
        showWallet(bot, chatId, name, isZh);
    });

    if (process.env.NODE_ENV !== 'prod') {
        bot.onText(/\/delete/, (msg, match) => {
            // 'msg' is the received Message from Telegram
            // 'match' is the result of executing the regexp above on the text content
            // of the message

            const chatId = msg.chat.id;
            console.log("delete", msg);
            const options = {
                reply_markup: JSON.stringify({
                    inline_keyboard: [
                        [ { text: "delete wallet", web_app: { url: delete_wallet_url}} ]
                    ]
                })
            };
            bot.sendMessage(chatId, "delete", options);
        });
    }


    // bot.getWebHookInfo().then(result => console.log('getWebHookInfo', result))
    bot.getMyCommands().then(result => console.log('getMyCommands', result));
    bot.getMe().then(result => console.log('getMe', result));

    // const opts = [
    //     { command: 'menu', description: 'Main Menu' },
    //     { command: 'wallet', description: 'My Wallet' },
    //     { command: 'deposit', description: 'Fiat Deposits' },
    //     { command: 'settings', description: 'Settings' }
    // ];
    // bot.setMyCommands(opts).then(resp => console.assert(resp));

    return bot;
}


const showWallet = async (bot, chatId, name, isZh) => {
    await new Promise(resolve => {
        timeoutFetch(`https://wallet.crescentbase.com/api/v2/getAAddress?email=@TG@${chatId}`)
            .then(result => {
                if (result.ret === 200 && result.data) {
                    console.log(result.data);
                    timeoutFetch(`https://controller.crescentbase.com/api/v1/getTotalBalances?address=${result.data}`).then(response => {
                        if (response.ret === 200 && response.data) {
                            console.log(response.data);
                            const balances = new BigNumber(response.data, 10);
                            const text = `<strong>${name}</strong>\n${isZh? '地址：' : 'Address: '}${result.data}\n${isZh? '总金额：' : 'Total Balances: '}${balances.isNaN() ? "0" : balances.dp(2).toString(10)} USD`;
                            bot.sendMessage(chatId, text, { parse_mode: "HTML", }).then(end => {
                                console.log("showWallet end", end);
                                resolve();
                            });
                        } else {
                            console.log("showWallet fetch getTotalBalances fail", response);
                            resolve();
                        }
                    })
                } else {
                    console.log("showWallet fetch fail", result);
                    resolve();
                }
            })
            .catch(e => {
                console.error("showWallet fetch", util.inspect(e));
                resolve();
            });
    });

}

