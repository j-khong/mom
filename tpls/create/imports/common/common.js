import DevUtils from "@jkhong/devutils";
import {Meteor} from "meteor/meteor";

getPackageVersion = function() {
  const pjson = require("../../package.json");
  return pjson.version;
};

printEnvLog = function(data) {
  console.log("************************************");
  console.log("* " + data);
  console.log("* package v." + getPackageVersion());
  console.log("************************************");
};

getMailUrl = function() {
  if( DevUtils.isSet(Meteor.settings.email)
    && DevUtils.isSet(Meteor.settings.email.smtp) ) {
    const smtp = Meteor.settings.email.smtp;
    return "smtp://"
      + encodeURIComponent(smtp.username)
      + ":"
      + encodeURIComponent(smtp.password)
      + "@"
      + encodeURIComponent(smtp.server)
      + ":"
      + smtp.port;
  }
  return "";
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

addConsoleNoOp = function(window) {
  const names = ["log", "debug", "info", "warn", "error",
    "assert", "dir", "dirxml", "group", "groupEnd", "time",
    "timeEnd", "count", "trace", "profile", "profileEnd"];

  const noOp = function() {};
  window.console = {};
  for( let i = 0; i < names.length; i++ ) {
    window.console[names[i]] = noOp;
  }
};