ServiceConfiguration.configurations.remove({
    service: 'facebook'
});
 
ServiceConfiguration.configurations.insert({
    service: 'facebook',
    appId: Meteor.settings.private.facebook.appId,
    loginStyle: "popup",
    secret: Meteor.settings.private.facebook.secret
});