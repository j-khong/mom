import { GlobalNS } from '../../../database/models/user.js';

var Model = GlobalNS.Database.User.Model;
Meteor.users.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.publish(Model.ColName, function(){
  return Meteor.users.find(this.userId, {
    fields: { 
      /*authorizedFieldToBePublished: 1,
      anotherAuthorizedFieldToBePublished: 1,*/
    }
  });
});

export { GlobalNS };
