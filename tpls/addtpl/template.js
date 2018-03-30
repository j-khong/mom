import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './tplname.html';

Template.tplname.onCreated(function () {
	var inst = this;
  console.log("onCreated");
  //Namespace.Database.Entity.Requests.subscribe(inst, tpl => {});
});

Template.tplname.onRendered(function () {
	console.log("onRendered");
});

Template.tplname.helpers({

});

Template.tplname.events({
  'click .someclass'(event, template){
    console.log('click someclass');
  },
  
  'submit form#someform'(event, template){
    event.preventDefault();
    console.log('submit form#someform');
  }
});

