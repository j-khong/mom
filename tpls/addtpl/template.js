import {Template} from "meteor/templating";
import {ReactiveVar} from "meteor/reactive-var";
import {NamespaceToReplace} from "/imports/client/controllers/tplname.js";
import "./tplname.html";

class UI extends NamespaceToReplace.UI.Vue {
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
  NamespaceToReplace.UI.Controllers.tplname.init(inst.ui);
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
  }
});

