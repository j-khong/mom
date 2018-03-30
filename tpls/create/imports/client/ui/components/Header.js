import './Header.html'

Template.Header.events({
    'click .logout': function(){
        console.log('click logout');
        //AccountsTemplates.logout();
        Meteor.logout();
    }
});