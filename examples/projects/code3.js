const QUAD_CS = P10;
const THERM = A2;
const BTN = P2;

PrimaryI2C.setup({sda: SDA, scl: SCL, bitrate: 100000});
SPI2.setup({mosi:B15, sck:B13, miso:B14});

const rtc = require('@amperka/rtc').connect(PrimaryI2C);
const quad = require('@amperka/quaddisplay2').connect({cs:QUAD_CS, spi:SPI2});

const thermometer = require('@amperka/thermometer').connect(THERM);
const button = require('@amperka/button').connect(BTN);

let showTime = true;
let interval = null;

function show(){
  if(showTime) {
    let time = rtc.getTime('unixtime');
    time = new Date(time*1000);
    let h = time.getHours();
    let m = time.getMinutes();
    h = (h > 10) ? h : '0'+h;
    m = (m > 10) ? m : '0'+m;
    quad.display(h+'.'+m);
    setTimeout(function() {
          quad.display(h+''+m);
    }, 50);
  } else {
    let temp = thermometer.read('C');
    quad.display(temp+"c");
  }
}

function setup() {
  if(interval) clearInterval(interval);
  show();
  interval = setInterval(show, 1000);
}

setup();

button.on('click', function(){
  showTime = !showTime;
  setup();
});
