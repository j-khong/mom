const OS = require("os");

module.exports = {
  currentIp: function() {

    const ifaces = OS.networkInterfaces();
    let address = undefined;

    Object.keys(ifaces).forEach(dev => {
      ifaces[dev].filter(details => {
        if( address === undefined && details.family === "IPv4" && details.internal === false ) {
          address = details.address;
        }
      });
    });
    return address;
  }
};