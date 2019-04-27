const CLI = require("@jkhong/cli-js");
var project = require("./project");
var lServer = require("./server");
var android = require("./android");
var network = require("./helpers/network.js");


class CustomManual extends CLI.Manual {
    about() {
        console.error("\nMoM stands for Meteor over the Moon\n");
        console.error("With its acronym - MoM - the project is on a mission : like a loving mom," +
            " MoM is there to nurture your meteor project, to guide your development in order to be happy," +
            " healthy and never grow old and die ;-)\n");
        console.error("Seriously, i believe that great developments come from great practices," +
            " that are human-incompatible on the long run, especially if you are working alone in your cave" +
            " (who wants to lose time with tests, whereas all the fun is in the dev?)\n");
        console.error("That's why you are provided with a structure of dev, based on :\n" +
            " - Single responsibility principle,\n" +
            " - Contract programming,\n" +
            " - Strong typing,\n" +
            " - Automatic tests" +
            " \n");
        console.error("MoM is here to take care of that, not to make all the job for you, but to make it waaaay easier");
    }
}

const pjson = require('../package.json');
const manualContent = {
    appName: "Meteor over the Moon",
    appSubTitle: " makes your bullet proof dev easier",
    appVersion: `v.${pjson.version}`,
    binName: "MoM",
    actionsGroups: [
        {
            name: "project",
            desc: "Project management actions",
            actions: [
                {
                    name: "create",
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
                {
                    name: "momify",
                    desc: "Add MoM features to current project",
                    switches: [
                        {
                            name: "ns",
                            desc: "The namespace",
                        }],
                    action: project.momify,
                },
                {
                    name: "addtpl",
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
                {
                    name: "addcoll",
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
                {
                    name: "addusers",
                    desc: "Add users management, login, etc...",
                    switches: [
                        {
                            name: "ui",
                            desc: "The client ui type (browser or mobile)",
                            default: "browser",
                        }],
                    action: project.addUsers,
                },
                {
                    name: "uc",
                    desc: "create a use case",
                    switches: [],
                    action: project.createuc,
                },
            ]
        },
        {
            name: "server",
            desc: "Server management actions",
            actions: [
                {
                    name: "deploy",
                    desc: "Deploy to your favorite server",
                    switches: [
                        {
                            name: "env",
                            desc: "The environment prx or prd",
                        }],
                    action: lServer.deploy,
                },
                {
                    name: "test2",
                    desc: "",
                    switches: [
                        {
                            name: "env",
                            desc: "The environment prx or prd",
                        }],
                    action: lServer.test2,

                },
            ]
        },
        {
            name: "android",
            desc: "Android management actions",
            actions: [
                {
                    name: "build",
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
                {
                    name: "launch",
                    desc: "",
                    switches: [],
                    action: android.test,
                },
            ]
        }
    ]
};

module.exports = new CustomManual(manualContent);