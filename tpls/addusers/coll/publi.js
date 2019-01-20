import {GlobalNS} from "/imports/database/models/user.js";

var Model = GlobalNS.Database.User.Model;

Meteor.publish(Model.ColName, function() {
   return Meteor.users.find(this.userId, {
      fields: {
         /*authorizedFieldToBePublished: 1,
         anotherAuthorizedFieldToBePublished: 1,*/
      }
   });
});

export {GlobalNS};
