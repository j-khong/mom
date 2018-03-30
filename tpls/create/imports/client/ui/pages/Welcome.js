import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './Welcome.html';

Template.Welcome.onCreated(function () {
	var inst = this;

  console.log("onCreated")
  //Namespace.Database.Entity.Requests.subscribe(inst, tpl => {});
});
function callback(inst){  }

Template.Welcome.onRendered(function () {
  console.log("onRendered")
});

Template.Welcome.helpers({

});

Template.Welcome.events({

});

