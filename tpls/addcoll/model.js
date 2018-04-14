import {MomUtils}     from "meteor/jkhong:momutils";
import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {GlobalNS}     from "/imports/common/_base.js";

GlobalNS.Database.collNS = {};
MomUtils.Database.create(GlobalNS.Database.collNS, "collNSlower");
let Model = GlobalNS.Database.collNS.Model;

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({
  _id: {type: String, optional: true},
  /// AUTOMATIC INSERTS SCHEMA ANCHOR
});

Model.Classes.collNS = class collNS extends MomUtils.Database.dbClass {
  constructor(data) {
    super(Model.Schemas.Main);
    this.init(data);
  }

  /// AUTOMATIC INSERTS METHODS ANCHOR

};

GlobalNS.Database.collNS.Functions.initColl(Model.Classes.collNS);

export {GlobalNS};