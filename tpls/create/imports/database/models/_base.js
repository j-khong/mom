import { Mongo } from 'meteor/mongo';
import { DevUtil } from 'meteor/crea16180:devutils';
import { NamespaceToReplace } from '../../common/_base.js';

NamespaceToReplace.Database = {};
NamespaceToReplace.Database.create = function(entity, collName){
  entity.Model = {
    Classes: {},
    Schemas: {}
  };
  if( collName ) {
    entity.Model.ColName = collName;
    entity.Model.Col = new Mongo.Collection(collName);
  }
  entity.Methods = {};
  entity.Requests = {
    subscribe: function(tpl, callback){
      entity.Requests.subscribeTo(entity.Model.ColName, null, tpl, callback);
    },
    subscribeTo: function(collname, data, tpl, callback){
      DevUtil.Collection.subscribe(tpl, collname, data, callback);
    }
  };
}

NamespaceToReplace.Database.Helpers = {};
NamespaceToReplace.Database.Helpers.DB = class DB {
  constructor(schema)
  {
    this.schema = schema
    //return new Proxy(this, this);
  }
  checkData(){
    check(this.data, this.schema);
  }
  init(data){
    check(data, this.schema);
    this.data = data;
  }
  getData(){ return this.data; }
  getKey(){ throw new Error("getKey is not implemented in class "+this.constructor.name); }

  setId(id){ this.data._id = id; return this; }
  getId(){ return this.data._id; }

/*
  get (target, prop) {
    //console.log(target)
    //console.log(this)
    console.log(prop)
    prop = prop.replace("get","").toLowerCase()
        console.log(prop)
        console.log(prop)
    var ret = this.data[prop];
    if( DevUtil.isNotSet(ret) ){
      throw new Meteor.Error("Dev", "prop "+prop+" missing");
    }
    return ret;
  }*/

  static fromDB(theclass, data){
    if( DevUtil.isSet(data) ){
      var c = new theclass();
      c.init(data);
      return c;
    }
    return null;
  }
}

/*
class Magic {
    constructor () {
        return new Proxy(this, this);
    }
    get (target, prop) {
        return this[prop] || 'MAGIC';
    }
}

let magic = new Magic();
magic.foo = 'NOT MAGIC';
console.log(magic.foo); // NOT MAGIC
console.log(magic.bar); 

var x = new Proxy({},{
  get(target,name) {
  return "Its hilarious you think I have "+name
}})

console.log(x.hair) // logs: "Its hilarious you think I have hair"
*/

export { NamespaceToReplace };