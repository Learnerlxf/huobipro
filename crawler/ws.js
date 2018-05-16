const moment = require('moment');
const WebSocket = require('ws');
const pako = require('pako');
const SaveData = require('../saveData');

const WS_URL = 'wss://api.huobi.pro/ws';
// 此地址用于国内不翻墙调试
//const WS_URL = 'wss://api.huobi.br.com/ws';

var orderbook = {};

exports.OrderBook = orderbook;

function handle(data) {
    //console.log('received', data.ch, 'data.ts', data.ts, 'crawler.ts', moment().format('x'));
    let symbol = data.ch.split('.')[1];
    let channel = data.ch.split('.')[2];
    switch (channel) {
        case 'depth':
            orderbook[symbol] = data.tick;
            //console.log(data.tick);
            break;
        case 'kline':
            //console.log('kline', data.tick);
            break;
    }
    let data_ch = data.ch;
    delete data.ch;
    SaveData.save(data_ch, JSON.stringify(data));
}

function subscribe(ws) {
    let symbols = ['htusdt'];
    let steps = ['step0','step1','step2','step3','step4','step5'];
    let periods = ['1min','5min','15min','30min','60min','1day','1mon','1week','1year'];
    for (let symbol of symbols) {
        // 订阅深度
        // 谨慎选择合并的深度，ws每次推送全量的深度数据，若未能及时处理容易引起消息堆积并且引发行情延时
        for (var i = 0; i < steps.length; i++) {            
            ws.send(JSON.stringify({
                "sub": `market.${symbol}.depth.${steps[i]}`,
                "id": `${symbol}`
            }));
        };   

        //订阅K线
        for (var i = 0; i < periods.length; i++) {
            ws.send(JSON.stringify({
                "sub": `market.${symbol}.kline.${periods[i]}`,
                "id": `${symbol}`
            }));
        }; 

        //订阅 Trade Detail 数据
        ws.send(JSON.stringify({
            "sub": `market.${symbol}.trade.detail`,
            "id": `${symbol}`
        }));
    }  
}

function init() {
    var ws = new WebSocket(WS_URL);
    ws.on('open', () => {
        console.log('open');
        subscribe(ws);
    });
    ws.on('message', (data) => {
        let text = pako.inflate(data, {
            to: 'string'
        });
        let msg = JSON.parse(text);
        if (msg.ping) {
            console.log(msg);
            ws.send(JSON.stringify({
                pong: msg.ping
            }));
        } else if (msg.tick) {
            // console.log(msg);
            handle(msg);
        } else {
            console.log(text);
        }
    });
    ws.on('close', () => {
        console.log('close');
        init();
    });
    ws.on('error', err => {
        console.log('error', err);
        init();
    });
}

init();