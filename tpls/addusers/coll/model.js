import SimpleSchema from "simpl-schema";
import {MomUtils}   from "meteor/jkhong:momutils";
import {GlobalNS}   from "/imports/common/_base";

GlobalNS.Database.User = {};
MomUtils.Database.create(GlobalNS.Database.User); // don't create mongo coll as it is native
var Model = GlobalNS.Database.User.Model;
Model.Col = Meteor.users;
Model.ColName = "userscolname";
Model.Col.deny(Model.Coll.DenyRules);

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({});

Model.Classes.User = class User extends MomUtils.Database.dbClass {
  constructor() {
    super(Model.Schemas.Main);
    this.init(data);
  }

  getFirstname() {
    if( this.data.profile && this.data.profile.firstname ) { return this.data.profile.firstname; }
    return "";
  }

  getLastname() {
    if( this.data.profile && this.data.profile.lastname ) { return this.data.profile.lastname; }
    return "";
  }
};

export {GlobalNS};
