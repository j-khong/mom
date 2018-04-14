const InputError = require("./errors/inputError");

module.exports = {
  switchPrefix: "--",
  about: function(cliOptions) {
    console.error("\nMoM stands for Meteor over the Moon\n");
    console.error("With its acronym - MoM - the project is on a mission : like a loving mom," +
      " MoM is there to nurture your meteor project, to guide your development in order to be happy," +
      " healthy and never grow old and die ;-)\n");
    console.error("Seriously, i believe that great developments come from great practices," +
      " that are human-incompatible on the long run, especially if you are working alone in your cave" +
      " (who wants to lose time with tests, whereas all the fun is in the dev?)\n");
    console.error("That's why you are provided with a structure of dev, based on :\n" +
      " - Single responsibility principle,\n" +
      " - Contract programming,\n" +
      " - Strong typing,\n" +
      " - Automatic tests" +
      " \n");
    console.error("MoM is here to take care of that, not to make all the job for you, but to make it waaaay easier");

    /*console.error('lorem ipsum'+
      ' lorem ipsum'+
      ' lorem ipsum'+
      ' \n');*/
  },
  printHelp: function(cliOptions) {
    var conf = cliOptions.conf;
    if( !conf ) { throw new Error("pass conf object as cliOptions: cliOptions.conf = conf;"); }
    var doc = cliOptions.doc;
    if( !doc ) { throw new Error("pass doc object as cliOptions: cliOptions.doc = doc;"); }

    var switchPrefix = doc.switchPrefix;

    var actionName = cliOptions._[1];
    if( actionName ) {
      var theAction = null;
      var theSection = null;
      Object.keys(conf).forEach((item) => {
        var tmpSection = conf[item];
        if( tmpSection.actions ) {
          if( tmpSection.actions[actionName] ) {
            theAction = tmpSection.actions[actionName];
            theSection = tmpSection;
          }
        }
      });
      if( theAction ) {
        displaySectionHeader(theSection);
        displayAction("  " + switchPrefix, actionName, theAction);
        return;
      }

      throw new InputError("no doc for action " + actionName);
    }

    console.error("\nSyntax: MoM <action> " + switchPrefix + "<flag> <value>");

    Object.keys(conf).forEach((item) => {
      var tmpSection = conf[item];
      if( tmpSection.actions ) {
        displayActions(tmpSection, switchPrefix);
      }
    });
  },
};

function displayActions(section, switchPrefix) {
  displaySectionHeader(section);
  var actions = section.actions;
  switchPrefix = "  " + switchPrefix;

  Object.keys(actions).forEach((item) => {
    displayAction(switchPrefix, item, actions[item]);
  });
}

function displaySectionHeader(section) {
  console.error("");
  console.error("\n" + section.desc);
  console.error("------------------------------");
}

function displayAction(switchPrefix, actionName, action) {
  var padding = 30;

  console.error(actionName.padEnd(padding) + " - " + action.desc);
  action.switches.forEach((aswitch) => {
    var str = switchPrefix + aswitch.name;
    if( aswitch.default ) { str += " (default: " + aswitch.default + ")"; }
    console.error(str.padEnd(padding) + " - " + aswitch.desc);
  });
  console.log("");
}