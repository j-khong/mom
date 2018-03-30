import './ui/pages/Login.js';
import './ui/pages/Profile.js';


FlowRouter.route('/login', {
	name: 'login',
	action(){
		BlazeLayout.render('Login');
	}
});


var loggedIn = FlowRouter.group({
	triggersEnter: [ 
	function(context, redirect, stop) {

		route = FlowRouter.current();
		console.log("enter "+route.route.name);

	    if( !Meteor.userId() ){
			console.log("user not logged");
			if( route.route.name != 'login' ){
				console.log("redirect to welcome");
				BlazeLayout.render('Login');
				stop();
			}
		}
	}]
});


loggedIn.route('/Profile', {
	name: 'profile',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Profile'});
	}
});
