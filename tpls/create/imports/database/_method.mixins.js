import { Meteor } from "meteor/meteor";
import { RestrictMixin } from "meteor/ziarno:restrict-mixin";

export const Mixins = {
    isAuthenticated: RestrictMixin.createMixin({
        condition: function (args) {
            return !Meteor.userId() && !Meteor.isServer;
        },
        error: function (args) {
            return new Meteor.Error("unauthorized", "You must be logged in to access this method.");
        }
    })
};
