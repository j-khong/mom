import { DevUtil } from 'meteor/crea16180:devutils';

getPackageVersion = function(){
  var pjson = require('../../package.json');
  return pjson.version;
}

printEnvLog = function(data){
  console.log("************************************");
  console.log("* "+ data);
  console.log("* package v."+getPackageVersion());
  console.log("************************************");
}

getMailUrl = function(){
  if( DevUtil.isSet(Meteor.settings.email)
   && DevUtil.isSet(Meteor.settings.email.smtp) ) {
    var smtp = Meteor.settings.email.smtp;
    return 'smtp://' 
    + encodeURIComponent(smtp.username) 
    + ':' 
    + encodeURIComponent(smtp.password) 
    + '@' 
    + encodeURIComponent(smtp.server) 
    + ':' 
    + smtp.port;
  }
  return "";
}

String.prototype.capitalize = function() {
 return this.charAt(0).toUpperCase() + this.slice(1);
}

addConsoleNoOp = function (window) {
    var names = ["log", "debug", "info", "warn", "error",
        "assert", "dir", "dirxml", "group", "groupEnd", "time",
        "timeEnd", "count", "trace", "profile", "profileEnd"],
        i, l = names.length,
        noOp = function () {};
    window.console = {};
    for (i = 0; i < l; i = i + 1) {
        window.console[names[i]] = noOp;
    }
};