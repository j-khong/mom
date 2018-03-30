import { ValidatedMethod } from 'meteor/mdg:validated-method';
import * as Mixins from './_method.mixins.js';
import { GlobalNS } from './models/user.js';

var Model = GlobalNS.Database.User.Model;

GlobalNS.Database.User.Methods.insert = new ValidatedMethod({
    name: 'User.insert',
    validate: new SimpleSchema({
        email: { type: String },
        pwd: { type: String }
      }).validator(),
    run({ email, pwd }) {
        var id = Accounts.createUser({
            email: email,
            password: pwd,
            profile: {
                firstname:"",
                lastname:""
            }
        });

        if( Meteor.isServer)
        { 
            Meteor.defer(()=>{
                return Accounts.sendVerificationEmail( id );
            });
        }
        else
        { return id; }
    }
});

GlobalNS.Database.User.Methods.SendVerificationEmail = new ValidatedMethod({
    name: 'User.SendVerificationEmail',
    validate: new SimpleSchema({
      }).validator(),
    mixins: [Mixins.authenticated],
    run({ }) {
        if( Meteor.isServer)
        { 
            var id = Meteor.userId();
            Meteor.defer(()=>{
                return Accounts.sendVerificationEmail( id );
            });
        }
        return "Le courrier de vérification est parti";
    }
});

export { GlobalNS };