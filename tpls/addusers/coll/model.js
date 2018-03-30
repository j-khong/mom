import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { GlobalNS } from './_base.js';

GlobalNS.Database.User = {};
GlobalNS.Database.create(GlobalNS.Database.User); // don't create mongo coll as it is native
var Model = GlobalNS.Database.User.Model;
Model.Col = Meteor.users;
Model.ColName = "userscolname";

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({
});

Model.Classes.User = class User extends GlobalNS.Database.Helpers.DB {
  constructor(){
    super(Model.Schemas.Main);
  }
  getFirstname(){ 
    if( this.data.profile && this.data.profile.firstname )
    { return this.data.profile.firstname; }
    return "";
  }
  getLastname(){ 
    if( this.data.profile && this.data.profile.lastname )
    { return this.data.profile.lastname; }
    return "";
  }

  static create(data){
    var c = new Model.Classes.User();
    c.init(data)
    return c;
  }
}

export {GlobalNS};
