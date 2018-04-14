import {MomUtils}     from "meteor/jkhong:momutils";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {GlobalNS}     from "/imports/common/_base.js";

GlobalNS.Database.User = {};
MomUtils.Database.create(GlobalNS.Database.User); // don't create mongo coll as it is native
var Model = GlobalNS.Database.User.Model;
Model.Col = Meteor.users;
Model.ColName = "userscolname";

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
