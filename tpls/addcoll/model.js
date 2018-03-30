import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { GlobalNS } from 'PATHTOBASE/_base.js';

GlobalNS.Database.collNS = {};
GlobalNS.Database.create(GlobalNS.Database.collNS, 'collNSlower');
var Model = GlobalNS.Database.collNS.Model;

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({
  _id: {type: String, optional: true},
  /// AUTOMATIC INSERTS SCHEMA ANCHOR
});
Model.Col.attachSchema(Model.Schemas.Main);

Model.Classes.collNS = class collNS extends GlobalNS.Database.Helpers.DB {
  constructor(){ super(Model.Schemas.Main); }
  /// AUTOMATIC INSERTS METHODS ANCHOR

  static create(data){
    var c = new Model.Classes.collNS();
    c.init(data)
    return c;
  }
}

export { GlobalNS };