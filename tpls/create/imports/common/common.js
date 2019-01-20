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
  if( DevUtils.isSet(Meteor.settings.private.email)
    && DevUtils.isSet(Meteor.settings.private.email.smtp) ) {
    const smtp = Meteor.settings.private.email.smtp;
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
  window.console = {};
  ["log", "debug", "info", "warn", "error",
    "assert", "dir", "dirxml", "group", "groupEnd", "time",
    "timeEnd", "count", "trace", "profile", "profileEnd"]
  .forEach(fctName => {
    window.console[fctName] = () => {};
  });
};