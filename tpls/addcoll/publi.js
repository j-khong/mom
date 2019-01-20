import {Meteor}   from "meteor/meteor";
import {GlobalNS} from "/imports/database/models/collName.js";

let Model = GlobalNS.Database.collNS.Model;

Meteor.publish(Model.ColName, function() {
  return Model.Col.find({});
});

export {GlobalNS};