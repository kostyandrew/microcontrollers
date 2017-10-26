var BUZ = require('@amperka/buzzer').connect(P3);
var RED = require('@amperka/led').connect(P2);
var GREEN = require('@amperka/led').connect(P9);
var BLUE = require('@amperka/led').connect(P8);

var TOKEN = '';
var SSID = '';
var PSWD = '';

var serial = PrimarySerial;
serial.setup(115200);

BUZ.frequency(2000);
BUZ.beep(1, 0.5);
RED.turnOff();
BLUE.turnOff();
GREEN.turnOff();

var bot = require('@amperka/telegram').create({
    token: TOKEN,
    polling: {
        interval: 1000,
        timeout: 0,
        limit: 1,
        retryTimeout: 5000
    }
});

var wifi = require('@amperka/wifi').setup(serial, function (err) {
    wifi.reset(function (err) {
        wifi.connect(SSID, PSWD, function (err) {
            BUZ.turnOff();
            console.log("wifi");
            bot.connect();
        });
    });
});

bot.on(['/start', '/back'], msg => {

    var keyboard = bot.keyboard([
        ['/red', '/green'],
        ['/blue', '/buzz']
    ], { resize: true });

    return bot.sendMessage(msg.from.id, 'Welcome,' + msg.from.first_name + '!', { markup: keyboard });

});

bot.on('/red', _ => {
    RED.blink(0.5);
});

bot.on('/green', _ => {
    GREEN.blink(0.5);
});

bot.on('/blue', _ => {
    BLUE.blink(0.5);
});

bot.on('/buzz', _ => {
    BUZ.beep(0.5);
});