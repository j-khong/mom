import {Meteor} from "meteor/meteor";
import "/imports/common/common.js";
import "./router.js";

Meteor.startup(() => {
   if( !Meteor.settings.public.activateConsole ) {
      if( !window.console || !window.development_mode ) {
         addConsoleNoOp(window);
      }
   }
   printEnvLog("Client env : " + Meteor.settings.public.env);
   /*
       sAlert.config({
           effect: 'genie',
           position: 'bottom-right',
           timeout: 3000,
       });
      */

});