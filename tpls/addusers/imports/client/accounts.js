import './router.js';

var myLogoutFunc = function(){
	console.log('AccountsTemplates onLogoutHook');
	//FlowRouter.go('/');
}
var mySubmitHook = function(){
	console.log('AccountsTemplates onSubmitHook');
}

AccountsTemplates.configure({
	onLogoutHook: myLogoutFunc,
	//onSubmitHook: mySubmitHook, // this one causes the login to fail
	forbidClientAccountCreation: false,
	sendVerificationEmail: true
});

Accounts.onLogin(function(){
	console.log("Accounts.onLogin")
	FlowRouter.go('profile');
});
Accounts.onLogout(function(){
	console.log("Accounts.onLogout")
	FlowRouter.go('/');
});