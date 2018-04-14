import {Meteor} from "meteor/meteor";

function isAuthenticated() {
  if( !Meteor.userId() ) {
    throw new Meteor.Error("unauthorized", "You must be logged in to access this method.");
  }
  ;
}

export const authenticated = createMixin(function() {
  if( Meteor.isServer ) { return true; }
  isAuthenticated();
});
export const notAuthenticated = createMixin(function() {
  if( Meteor.userId() ) {throw new Meteor.Error("unauthorized", "You must not be logged to access this method.");}
  ;
});

export const isServer = createMixin(function() {
  return Meteor.isServer;
});

function createMixin(callback) {
  var myMixin = function(methodOptions) {
    const runFunc = methodOptions.run;
    methodOptions.run = function() {
      callback.call(this, ...arguments);
      return runFunc.call(this, ...arguments);
    };

    return methodOptions;
  };

  return myMixin;
}

CheckContext = function(validationContext) {
  if( !validationContext.isValid() ) {
    var msg = "";
    validationContext.invalidKeys().forEach(function(key) {
      msg += "name [" + key.name + "] has value [" + key.value + "]";
    });
    console.log(msg);
    throw new Meteor.Error(msg);
  }
};