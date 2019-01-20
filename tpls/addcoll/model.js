import SimpleSchema from "simpl-schema";
import { MomUtils } from "meteor/jkhong:momutils";
import { GlobalNS } from "/imports/common/_base.js";

GlobalNS.Database.collNS = {};
MomUtils.Database.create(GlobalNS.Database.collNS, "collNSlower");
let Model = GlobalNS.Database.collNS.Model;

/*
 *
 * SCHEMAS & CLASSES
 *
 */
Model.Schemas.Main = new SimpleSchema({
    /// AUTOMATIC INSERTS SCHEMA ANCHOR
});

Model.Classes.collNS = class collNS extends MomUtils.Database.dbClass{
    constructor(data) {
        super(Model.Schemas.Main, data);
    }

    /// AUTOMATIC INSERTS METHODS ANCHOR

};

GlobalNS.Database.collNS.Functions.initColl(Model.Classes.collNS);

export { GlobalNS };