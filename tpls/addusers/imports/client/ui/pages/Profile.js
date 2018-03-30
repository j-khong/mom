import {GlobalNS} from '../../../database/user.js';

import './Profile.html';

Template.Profile.onCreated(function () {
	var inst = this;

	/*inst.{{CollName}}SubsReady = new ReactiveVar(false);
	inst.subscribe(NS.CollName.ColName, {
        onReady: () => {
            inst.{{CollName}}SubsReady.set(true);
        }
    });*/

    inst.subscribe(GlobalNS.Database.User.Model.ColName);
});

Template.Profile.onRendered(function () {
	
});

Template.Profile.helpers({

});

Template.Profile.events({
});
