import {MomUtils}           from "meteor/jkhong:momutils";
import {Template}           from "meteor/templating";
import {ReactiveVar}        from "meteor/reactive-var";
import {NamespaceToReplace} from "/imports/client/controllers/tplname.js";
import "./tplname.html";

class UI extends MomUtils.Client.UI.uiClass {
  constructor() {
    super(5000);// msg timeout
    this.someVar = new ReactiveVar(null);
  }
}

Template.tplname.onCreated(function() {
  var inst = this;
  console.log("onCreated");
  //NamespaceToReplace.Database.Entity.Requests.subscribe(inst, tpl => {});
  inst.ui = new UI();
  NamespaceToReplace.Client.Controllers.tplname.init(inst.ui);
});

Template.tplname.onRendered(function() {
  console.log("onRendered");
});

Template.tplname.helpers({});

Template.tplname.events({
  "click .clickBtn"(event, template) {
    console.log("click clickBtn");
  },

  "submit form#someform"(event, template) {
    event.preventDefault();
    console.log("submit form#someform");
  },
});

