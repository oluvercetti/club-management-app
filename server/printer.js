const escpos = require('escpos');
escpos.USB = require('escpos-usb');


const print = (text) => {

  try {
    const device = new escpos.USB();
    const options = { encoding: "GB18030" }
    const printer = new escpos.Printer(device, options)
      device.open(function () {
        printer
          .font('a')
          .align('ct')
          .style('bu')
          .size(1, 1)
          .text(text)
          .cut()
          .close();
      });
  } catch (err){
    console.log(err);
    throw new Error(err);
  }

}

module.exports = print;