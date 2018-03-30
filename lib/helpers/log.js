const DevError = require("../errors/devError");

module.exports = {
  formatError: function(input){
    if( !Array.isArray(input) ) { throw new DevError("formatError input arg must be an array"); }
    if( !input || input.length == 0 ){ return; }

    var msgs = [];
    input.forEach((val)=>{
      let sp = val.split(/\r?\n/);
      if( Array.isArray(sp) )
      { msgs = msgs.concat(sp); }
      else
      { msgs.push(val); }
    });
    msgs = msgs.filter(function(n){ return n != "" }); 

    var maxlength = 0;
    msgs.forEach((msg)=>{
      if( msg.length > maxlength ){ maxlength = msg.length; }
    });

    var symbol = "*";
    var begin = symbol + " ";
    var end = " " + symbol + "\n";
    var formatted = "";
    msgs.forEach((msg)=>{
      formatted += begin + msg.padEnd(maxlength) + end;
    });

    var str = "".padEnd(begin.length + maxlength + end.length -1, symbol) + "\n";
    return str + formatted + str;
  },
  formatHeader: function(msgs){
    if( !Array.isArray(msgs) ) { throw new DevError("formatHeader input arg must be an array"); }
    if( !msgs || msgs.length == 0 ){ return; }

    var maxlength = 0;
    msgs.forEach((msg)=>{
      if( msg.length > maxlength ){ maxlength = msg.length; }
    });

    var symbol = "*";
    var begin = symbol + " ";
    var end = " " + symbol + "\n";
    var formatted = "";
    msgs.forEach((msg)=>{
      formatted += begin + msg.padEnd(maxlength) + end;
    });

    var str = "".padEnd(begin.length + maxlength + end.length -1, symbol) + "\n";
    return str + formatted + str;
  },
  displayError: function(msg)
  { console.error(this.formatError([msg]).bold.red); }
  
}