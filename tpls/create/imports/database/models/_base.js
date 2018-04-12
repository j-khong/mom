import {Mongo} from "meteor/mongo";
import {DevUtil} from "/imports/common/devutils";
import {NamespaceToReplace} from "/imports/common/_base.js";

NamespaceToReplace.Database = {};
NamespaceToReplace.Database.create = function(entity, collName) {
  entity.Model = {
    Classes: {},
    Schemas: {}
  };
  if( collName ) {
    entity.Model.ColName = collName;
  }
  entity.Methods = {};
  entity.Requests = {
    subscribe: function(tpl, callback) {
      entity.Requests.subscribeTo(entity.Model.ColName, null, tpl, callback);
    },
    subscribeTo: function(collname, data, tpl, callback) {
      tpl.subscribe(collname, data, {
        onReady: () => { if( callback ) {callback(tpl);} }
      });
    },
    getByKey: function(data) {
      check(data, entity.Model.Schemas.Main);
      return entity.Model.Col.findOne(data.getKey());
    },
    getById: function(data) {
      check(data, entity.Model.Schemas.Main);
      return entity.Model.Col.findOne({_id: data.getId()});
    }
  };
  entity.Functions = {
    initColl: function(theclass) {
      let model = entity.Model;
      if( model.ColName ) {
        model.Col = new Mongo.Collection(model.ColName, {
          transform: (doc) => new theclass(doc)
        });
        model.Col.attachSchema(model.Schemas.Main);
      }
    }
  };
};

NamespaceToReplace.Database.Helpers = {};
NamespaceToReplace.Database.Helpers.DB = class DB {
  constructor(schema) {this.schema = schema;}

  checkData() {check(this.data, this.schema);}

  init(data) {
    check(data, this.schema);
    this.data = data;
  }

  getData() {return this.data;}

  getKey() {throw new Error("getKey is not implemented in class " + this.constructor.name);}

  setId(id) {
    this.data._id = id;
    return this;
  }

  getId() {return this.data._id;}

};

export {NamespaceToReplace};