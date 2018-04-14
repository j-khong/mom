import _                 from "underscore";
import {Meteor}          from "meteor/meteor";
import {ValidatedMethod} from "meteor/mdg:validated-method";
import {SimpleSchema}    from "meteor/aldeed:simple-schema";
import * as Mixins       from "./_method.mixins.js";
import {GlobalNS}        from "./models/user.js";

let Model = GlobalNS.Database.User.Model;

_.extend(GlobalNS.Database.User.Methods, {

  insert: new ValidatedMethod({
    name: "User.insert",
    validate: new SimpleSchema({
      email: {type: String},
      pwd: {type: String},
    }).validator(),
    run({email, pwd}) {
      const id = Accounts.createUser({
        email: email,
        password: pwd,
        profile: {
          firstname: "",
          lastname: "",
        },
      });

      if( Meteor.isServer ) {
        Meteor.defer(() => {
          return Accounts.sendVerificationEmail(id);
        });
      }
      else { return id; }
    },
  }),

  sendVerificationEmail: new ValidatedMethod({
    name: "User.sendVerificationEmail",
    validate: new SimpleSchema({}).validator(),
    mixins: [Mixins.authenticated],
    run({}) {
      if( Meteor.isServer ) {
        const id = Meteor.userId();
        Meteor.defer(() => {
          return Accounts.sendVerificationEmail(id);
        });
      }
      return "Le courrier de vérification est parti";
    },
  }),
});

export {GlobalNS};