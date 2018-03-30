
FlowRouter.route('/ROUTENAME', {
  name: 'ROUTECALLNAME',
  action(){
    BlazeLayout.render('MainLayout', {main: 'TPLNAME'});
  }
});
