import {Meteor} from "meteor/meteor";

import "/imports/common/common.js";
import "/imports/database/_imports.js";
import "./router.js";
import "./database/publications/_imports.js";
import "./database/data/upgrades.js";

function pushName(obj, arr) {
   Object.keys(obj).forEach((item) => {
      var name = obj[item].name;
      if( name ) arr.push(name);
   });
}

function getMethodsList() {
   var arr = [];
   //pushName(NAMESPACE.Database.ENTITY.Methods, arr);
   return arr;
}

// Only allow 5 list operations per connection per second
DDPRateLimiter.addRule({
   name(name) {
      return _.contains(getMethodsList(), name);
   },

   // Rate limit per connection ID
   connectionId() { return true; }
}, 5, 1000); // 5 requests every 1000ms

Meteor.startup(() => {
   printEnvLog("Server env : " + Meteor.settings.public.env);

   doUpgrades();

   /// AUTOMATIC INSERTS ANCHOR
   /*
       SyncedCron.add({
           name: "SendDayMealEmail",
           schedule: function(parser) {
             /* fires at 10:50am every day
             var cron = '50 10 * * ? *';
             return parser.cron(cron);*/
   /*
             //return parser.recur().on(8).hour();

             return parser.text('at 6:00 am');
           },
           job: function() {
             console.log("il est l'heure");
             SendDayMealEmail();
             return 0;
           }
         });

       SyncedCron.start();*/
});
