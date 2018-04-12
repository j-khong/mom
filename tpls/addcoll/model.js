import {SimpleSchema} from "meteor/aldeed:simple-schema";
import {GlobalNS} from "/imports/database/models/_base.js";

GlobalNS.Database.collNS = {};
GlobalNS.Database.create(GlobalNS.Database.collNS, "collNSlower");
var Model = GlobalNS.Database.collNS.Model;

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({
  _id: {type: String, optional: true}
  /// AUTOMATIC INSERTS SCHEMA ANCHOR
});

Model.Classes.collNS = class collNS extends GlobalNS.Database.Helpers.DB {
  constructor(data) {
    super(Model.Schemas.Main);
    this.init(data);
  }

  /// AUTOMATIC INSERTS METHODS ANCHOR

};

GlobalNS.Database.collNS.Functions.initColl(Model.Classes.collNS);

export {GlobalNS};