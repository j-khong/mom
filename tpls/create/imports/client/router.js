import "./ui/layouts/MainLayout.js";

BlazeLayout.setRoot("body");

FlowRouter.route("/", {
  name: "root",
  action() {
    BlazeLayout.render("MainLayout", {main: "Welcome"});
  }
});

FlowRouter.notFound = {
  action: function() {
    FlowRouter.go("root");
  }
};
