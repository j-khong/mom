import { GlobalNS } from '../../../database/models/collName.js';

var Model = GlobalNS.Database.collNS.Model;
Model.Col.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.publish(Model.ColName, function(){
  return Model.Col.find({});
});

export { GlobalNS };