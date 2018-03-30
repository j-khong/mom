import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { DevUtil } from 'meteor/crea16180:devutils';
import * as Mixins from 'PATHTOMIXIN/_method.mixins.js';
import { GlobalNS } from './models/collName.js';

var Model = GlobalNS.Database.collNS.Model;

GlobalNS.Database.collNS.Methods.insert = new ValidatedMethod({
  name: 'collNS.insert',
  validate: Model.Schemas.Main.validator(), // or validate(){}, or validate(name){check(name, String);}, or null,
  mixins: [Mixins.authenticated],
  run(data) {
    var oData = Model.Classes.collNS.create(data);
    
    var oDbData = GlobalNS.Database.collNS.Requests.getByKey(oData.getKey());
    if( DevUtil.isSet(oDbData) )
    { throw new Meteor.Error("User", "data already in base"); }

    oDbData = oData;
    console.log("inserting data");
    oDbData.setId(Model.Col.insert(data));
    console.log(oData.getData());

    return oDbData.getId();
  }
});

/*
 *
 * REQUESTS
 * only read functions, for write, see methods
 */
GlobalNS.Database.collNS.Requests.getByKey = function(key){ return GlobalNS.Database.Helpers.DB.fromDB(Model.Classes.collNS, Model.Col.findOne(key)); }
GlobalNS.Database.collNS.Requests.getById = function(id){ return GlobalNS.Database.Helpers.DB.fromDB(Model.Classes.collNS, Model.Col.findOne({_id:id})); }


export { GlobalNS };