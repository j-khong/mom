import { GlobalNS } from '../database/models/user.js';


RedefineAccountsRoutes = function(){
/*	if redefine built-in route, must implement the code in the router for these new links
    // Configures "reset password account" email link
    Accounts.urls.resetPassword = function(token){
        return Meteor.absoluteUrl("reset-password/" + token);
    };

    // Configures "enroll account" email link
    Accounts.urls.enrollAccount = function(token){
        return Meteor.absoluteUrl("enroll-account/" + token);
    };
  // Configures "verify email" email link
  Accounts.urls.verifyEmail = function(token){
    return Meteor.absoluteUrl("verify-email/" + token);
  };*/


  Accounts.emailTemplates.siteName = Meteor.settings.private.email.website;
  Accounts.emailTemplates.from = Meteor.settings.private.email.firstname+" <"+Meteor.settings.private.email.smtp.username+">";
  Accounts.emailTemplates.enrollAccount = {
    //from(){/*to reset the previous setting*/},
    subject (user) {
      return "title " + GlobalNS.User.getUserName(user);
    },
    text (user, url) {
      return "lorem\n\n"
         + "signature."
         ;
    }
  };

  Accounts.emailTemplates.resetPassword = {
    subject (user) {
      return Meteor.settings.private.email.titlePrefix+" change pwd link";
    },
    html(user, url){
      console.log("send reset pwd email to "+user.emails[0].address);
      let urlWithoutHash = url;//.replace( '#/', '' );
      var data = {
        firstname: P4C.User.getUserName(user),
        link: urlWithoutHash,
        signature: Meteor.settings.private.email.signature,
      };
      return buildHtmlEmail('reset-pwd.html', data);
    }
  };


  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return Meteor.settings.private.email.titlePrefix+" confirm email link";
    },
    html( user, url ) {
      console.log("send check email to "+user.emails[0].address);
      let urlWithoutHash = url;//.replace( '#/', '' );
      var data = {
        link: urlWithoutHash,
        signature: Meteor.settings.private.email.signature,
        website: Meteor.settings.private.email.website
      };
      return buildHtmlEmail('email-verification.html', data);
    }
  };
}
function buildHtmlEmail(emlTpl, data){
  SSR.compileTemplate(emlTpl, Assets.getText('email/tpl/'+emlTpl));
  var content = SSR.render(emlTpl, data);
  //console.log(content)
  return content;
}

Accounts.onCreateUser( ( options, user ) => {
  console.log(user);console.log(options);
  
  if (user.services.facebook) {
    var fb = user.services.facebook;
    user.emails = [{
      address: fb.email,
      verified: true
    }];

    user.profile = {};
    if( fb.first_name )
    { user.profile.firstname = fb.first_name; }
    if( fb.last_name )
    { user.profile.lastname = fb.last_name; }
    if( fb.gender )
    { 
        var g = "F";
        if( fb.gender == "male" )
        { g = "H"; }
        user.gender = g;
    }

    console.log(fb.age_range)
    console.log(fb.user_birthday);
    user.fbAvatarUrl = "http://graph.facebook.com/"+fb.id+"/picture/"
  }
  else
  {
    if( options.profile )
    { user.profile = options.profile; }
  }
/*
  user.md5hash = Gravatar.hash( user.emails[0].address );
  if( _(user.fbAvatarUrl).isBlank() )
  { 
    user.useGravatar = true;
    user.useFbAvatar = false;
  }
  else
  {
    user.useGravatar = false;
    user.useFbAvatar = true;
   }*/
  
  return user;
});


function getFbPicture(accessToken) {
  var result;
  result = Meteor.http.get("https://graph.facebook.com/me", {
    params: {
        access_token: accessToken,
        fields: 'picture'
    }
  });
  if (result.error) {
    //throw result.error;
    return "";
  }

  return result.data.picture.data.url;
};