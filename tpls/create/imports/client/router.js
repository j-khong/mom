import './ui/layouts/MainLayout.js';
import './ui/pages/Welcome.js';

BlazeLayout.setRoot('body');

FlowRouter.route('/', {
	name: 'welcome',
	action(){
		BlazeLayout.render('MainLayout', {main: 'Welcome'});
	}
});

FlowRouter.notFound = {
    action: function() {
			FlowRouter.go('welcome');
    }
};
/*

admin.route('/', {
	name: 'admin',
	action(){
		import '../../ui/pages/admin/Admin.js';
		var targetTemplate = 'Admin';
		RenderAdminTemplate(targetTemplate);
	}
});


function RenderAdminTemplate(tplName){
		import '../../ui/pages/admin/AdminChecker.js';
		BlazeLayout.render('Dashboard', {main: 'AdminChecker', targetTemplate:tplName});
}
*/