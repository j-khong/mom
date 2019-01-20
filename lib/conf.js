const path = require("path");

var doc = require("./doc");
var project = require("./project");
var lServer = require("./server");
var android = require("./android");
var network = require("./helpers/network.js");

module.exports = {
  getAction: function(actionName) {
    var action = null;
    Object.keys(this).forEach((actionsByType) => {
      var actions = this[actionsByType]["actions"];
      if( actions ) {
        var tmp = actions[actionName];
        if( tmp ) { action = tmp; }
      }
    });
    return action;
  },
  project: {
    desc: "Project management actions",
    actions: {
      create: {
        desc: "Create a new MoM project in the current folder",
        switches: [
          {
            name: "name",
            desc: "The name of the project",
          }, {
            name: "ns",
            desc: "The namespace",
          }, {
            name: "mv",
            desc: "Meteor version",
            default: "1.5.4",
          }],
        action: project.create,
      },
      momify: {
        desc: "Add MoM features to current project",
        switches: [
          {
            name: "ns",
            desc: "The namespace",
          }],
        action: project.momify,
      },
      addtpl: {
        desc: "Create a new template",
        switches: [
          {
            name: "name",
            desc: "The template name",
          }, {
            name: "ui",
            desc: "The type of ui (browser or mobile)",
            default: "browser",
          }],
        action: project.addTemplate,
      },
      addcoll: {
        desc: "Create a new collection",
        switches: [
          {
            name: "name",
            desc: "The collection name",
          }, {
            name: "schema",
            desc: "The data structure, ex. \"fields1:String fields2:Number\"",
          }, {
            name: "type",
            desc: "public (client) or private (server)",
            default: "public",
          }],
        action: project.addCollection,
      },
      addusers: {
        desc: "Add users management, login, etc...",
        switches: [
          {
            name: "ui",
            desc: "The client ui type (browser or mobile)",
            default: "browser",
          }],
        action: project.addUsers,
      },
      uc: {
        desc: "create a use case",
        switches: [],
        action: project.createuc,
      },
    },
  },
  server: {
    desc: "Server management actions",
    actions: {
      deploy: {
        desc: "Deploy to your favorite server",
        switches: [
          {
            name: "env",
            desc: "The environment prx or prd",
          }],
        action: lServer.deploy,
      },
      test2: {
        desc: "",
        switches: [
          {
            name: "env",
            desc: "The environment prx or prd",
          }],
        action: lServer.test2,

      },
    },
  },
  android: {
    desc: "Android management actions",
    actions: {
      build: {
        desc: "Build the apk and deliver it to the delivery folder",
        switches: [
          {
            name: "url",
            desc: "The server url",
            default: "http://" + network.currentIp() + ":3000",
          },
          {
            name: "settings",
            desc: "mobile settings file",
            default: "none",
          }],
        action: android.buildAndShare,
      },
      launch: {
        desc: "",
        switches: [],
        action: android.test,
      },
    },
  },
  doc: {
    desc: "Misc",
    actions: {
      help: {
        desc: "this help",
        switches: [],
        action: doc.printHelp,
      },
      about: {
        desc: "Discover the purpose of MoM",
        switches: [],
        action: doc.about,
      },
    },
  },
};

function dumb(action) {
  throw new Error("please initialise action fct of action desc [" + action.desc + "]");
}