import _                 from "underscore";
import DevUtils          from "@jkhong/devutils";
import {Meteor}          from "meteor/meteor";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import * as Mixins       from "/imports/database/_method.mixins.js";
import {GlobalNS}        from "./models/collName.js";

let Model = GlobalNS.Database.collNS.Model;
_.extend(GlobalNS.Database.collNS.Methods, {

  insert: new ValidatedMethod({
    name: "collNS.insert",
    validate: Model.Schemas.Main.validator(), // or validate(){}, or validate(name){check(name, String);}, or null,
    mixins: [Mixins.authenticated],
    run(data) {
      let oData = new Model.Classes.collNS(data);

      let oDbData = GlobalNS.Database.collNS.Requests.getByKey(oData);
      if( DevUtils.isSet(oDbData) ) { throw new Meteor.Error("User", "data already in base"); }

      oDbData = oData;
      console.log("inserting data");
      oDbData.setId(Model.Col.insert(data));
      console.log(oData.getData());

      return oDbData.getId();
    },
  }),

});

export {GlobalNS};