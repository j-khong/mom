import {ReactiveVar} from "meteor/reactive-var";
import {GlobalNS} from "/imports/database/user.js";
import "./Login.html";

Template.Login.onCreated(function() {
   this.error = new ReactiveVar("");
   this.pwderror = new ReactiveVar("");
   this.msg = new ReactiveVar("");

   this.email = "";
   this.pwd = "";
});

Template.Login.onRendered(function() {
   const self = this;
   Meteor.setTimeout(function() {
      self.error.set("");
      self.pwderror.set("");
      self.msg.set("");
   }, 3000);
});

Template.Login.events({
   "click .logout": function() {
      console.log("click logout");
      //AccountsTemplates.logout();
      Meteor.logout();
   },
   //
   // LOGIN
   //
   "submit form#connection-form": function(event, template) {
      event.preventDefault();
      template.error.set("");
      var emailVar = event.target.email.value;
      var passwordVar = event.target.password.value;

      if( emailVar === "" ) {
         template.error.set("veuillez renseigner un email");
         return;
      }

      if( passwordVar === "" ) {
         template.error.set("veuillez renseigner un mot de passe");
         return;
      }

      Meteor.loginWithPassword(emailVar, passwordVar, function(error) {
         if( error ) {
            template.error.set("informations incorrectes");
         }
         else {
            console.log("Meteor.loginWithPassword CB ok");
            console.log(Meteor.user());
         }
      });
   },
   "click #facebook-login": function(event, template) {
      Meteor.loginWithFacebook({
         requestPermissions: ["public_profile", "email"]
      }, function(err) {
         if( err ) {
            template.error.set("Problème de connexion à Facebook");
         }
      });
   },
   //
   // CREATION COMPTE
   //
   "click .create-account": function(event) {
      $("#create-account-modal").modal("show");
   },
   "submit form#create-account-form": function(event, template) {
      event.preventDefault();

      template.error.set("");
      template.msg.set("");
      var emailVar = event.target.email.value;
      var passwordVar = event.target.password1.value;
      var passwordVar2 = event.target.password2.value;

      if( emailVar === "" ) {
         template.error.set("veuillez renseigner un email");
         return;
      }
      if( passwordVar === "" ) {
         template.error.set("veuillez renseigner un mot de passe");
         return;
      }
      if( passwordVar !== passwordVar2 ) {
         template.error.set("Les deux mot de passe saisis sont différents");
         return;
      }

      template.msg.set("en cours de traitement...");

      template.email = emailVar;
      template.pwd = passwordVar;

      GlobalNS.Database.User.Methods.insert.call({email: emailVar, pwd: passwordVar}, function(error, result) {
         if( error ) {
            var msg = "erreur inconnue";
            if( error.error == 403 ) { msg = "Cet email est déjà utilisé"; }
            console.log(error);
            template.msg.set("");
            template.error.set(msg);
         }
         else {
            console.log("newly created user id:" + result);
            Meteor.setTimeout(() => {
               $("#create-account-modal").modal("hide");
               $("#create-account-msg-modal").modal("show");
            }, 1000);
         }
      });

   },
   "submit form#create-account-msg-form": function(event, template) {
      event.preventDefault();

      console.log("login : " + template.email + " " + template.pwd);
      $("#create-account-msg-modal").modal("hide");
      Meteor.loginWithPassword(template.email, template.pwd, error2 => {
         if( error2 ) { template.error.set("problème de connexion"); }
      });
   },

   //
   // NOUVEAU MDP
   //
   "click .forgot-password": function(event) {
      $("#chg-pwd-modal").modal("show");
   },
   "submit form#chg-pwd-form": function(event, template) {
      event.preventDefault();
      template.pwderror.set("");
      template.msg.set("");
      var emailVar = event.target.chgpwdemail.value;

      if( emailVar === "" ) {
         template.pwderror.set("veuillez renseigner un email");
         return;
      }

      var options = {};
      options.email = emailVar;
      template.msg.set("en cours de traitement...");
      Accounts.forgotPassword(options, function(error) {
         if( error ) {
            template.msg.set("");
            template.pwderror.set("cet email est inconnu");
         }
         else {
            template.msg.set("un email vient de vous être envoyé pour changer votre mot de passe");
         }
      });
   },
   //
   //
   //
   "click .close-error": function(event, template) {
      template.error.set("");
   },
   "click .close-pwderror": function(event, template) {
      template.pwderror.set("");
   },
   "click .close-modal": function(event, template) {
      template.pwderror.set("");
      template.error.set("");
      template.msg.set("");
   }
});

Template.Login.helpers({
   error: function() {
      return Template.instance().error.get();
   },
   pwderror: function() {
      return Template.instance().pwderror.get();
   },
   msg: function() {
      return Template.instance().msg.get();
   }
});