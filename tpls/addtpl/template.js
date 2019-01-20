import { MomUtils } from "meteor/jkhong:momutils";
import { Template } from "meteor/templating";
import { ReactiveVar } from "meteor/reactive-var";
import { NamespaceToReplace } from "/imports/client/controllers/tplname.js";
import "./tplname.html";

class UI extends MomUtils.Client.UI.uiClass {
  constructor() {
    super(5000);// msg timeout
    this.someVar = new ReactiveVar(null);
  }
}

const Ctrl = NamespaceToReplace.Client.Controllers.tplname;
const Requests = NamespaceToReplace.Database.Entity.Requests;

Template.tplname.onCreated(function () {
  var inst = this;
  console.log("onCreated");
  //Requests.subscribe(inst, callback);
  //Requests.subscribeTo(collname, data = null, inst, callback);

  inst.ui = new UI();
  Ctrl.init(inst.ui);
});
function callback(inst) {
  // const obj = Requests.findOne();
  // inst.somereactivevar.set(obj);
}

Template.tplname.onRendered(function () {
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

