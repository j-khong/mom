const Mkdirp = require('mkdirp');
const Notifier = require('osx-notifier');
const ExecSync = require('child_process').execSync;
const Moment = require('moment');
const SCP = require('scp');
const Path = require('path');
const FS = require('fs');
const ReadlineSync = require('readline-sync');
const Settings = require("./helpers/momSettings");
const Log = require("./helpers/log");
const Conv = require("./helpers/momConventions");
const ConfError = require("./errors/confError");
const File = require("./helpers/file");

module.exports = {
  test: function(cliOptions){
    let cmd = 'export ROOT_URL=http://192.168.1.72:3000 && meteor npm run dev';
      console.log(cmd)
      r = ExecSync(cmd);
      console.log(r.toString());
      console.log('')
  
  },
  buildAndShare: function(cliOptions){

    let url = cliOptions["url"];/*
    let env = cliOptions["env"];
    let envfile = Conv.getSettingsFile(env);  
    if( !FS.existsSync(envfile)){ throw new ConfError("conf file " + envfile + " is missing"); }*/

    let prjConf = Settings.getProjectConf();
    let androidConf = Settings.getAndroidConf();
    if( !androidConf ) 
    {
      let aHeader = ["you have not configured the project for android build, let's do that!"];
      console.log(Log.formatHeader(aHeader));
      console.log('');
      let keystoreFolder = ReadlineSync.question('If you already have a folder to store your apks keystore, that\'s your chance, leave empty otherwise : '); 
      if( keystoreFolder.trim() == "" ){ keystoreFolder = "~/.keystore"; }
      keystoreFolder = Path.resolve(keystoreFolder);
      Mkdirp(keystoreFolder);
      let keystorePwd = ReadlineSync.question('What is the password? : '); 
      let keystoreName = prjConf.name + ".keystore";
      let keystoreAlias = prjConf.name;
      console.log("thanks very much, i'm saving these precious data...");
      console.log('');

      //TODO create here the keystore
      androidConf = Settings.saveAndroidConf(keystoreFolder, keystorePwd, keystoreName, keystoreAlias);
    }
    let androidDelivery = androidConf.delivery;
    if( !androidDelivery ) 
    {
      let aHeader = ["you have not configured a delivery folder for your app build, let's do that!"];
      console.log(Log.formatHeader(aHeader));
      console.log('');
      let path = ReadlineSync.question('what is the full path of that folder? : ');
      while( !FS.existsSync(path) ){
        path = ReadlineSync.question('this path is unreacheable, check that or give another one : ');
      }
      console.log("thanks very much, i'm saving this precious data...");
      console.log('');
    
      androidDelivery = Settings.saveAndroidDeliveryConf(path);
    }

    // build
    var start = Moment().format("HH:mm");
    console.log('build starts at '+start);

    try{
      let buildFolderPath = "/tmp/tmpbuild"
      let buildFolderName = "android"
      let destFolderFullPath = Path.join(buildFolderPath, buildFolderName);
      
      //execCmd('ls');//'[ -d "'+buildFolderPath+'" ] && { rm -fr "'+buildFolderPath+'"; }');

      execCmd('rm -fr .meteor/local/cordova-build/');

      execCmd('cd '+Path.resolve()
      +' && meteor build "'+buildFolderPath+'/" --server '+url);

      let apk = Path.join(destFolderFullPath, "release-unsigned.apk");
      if( !FS.existsSync(apk))
      { console.log("missing apk "+apk); }

      // TODO check keystore path again here, in case user changed values in conf file
      execCmd('jarsigner -keystore '+Path.resolve(androidConf.keystore.folder, androidConf.keystore.name)
      +' -storepass '+androidConf.keystore.pwd+' '+apk+' '+androidConf.keystore.alias);

      //+' && mv release-unsigned.apk '+Path.resolve(androidDelivery.folder, prjConf.name+'.signed.apk');
      execCmd('mv '+apk+' '+Path.resolve(androidDelivery.folder, prjConf.name+'.signed.apk'));

      let msg = "export ROOT_URL="+url+" && meteor npm run dev";
      Notifier({
        type: "pass",//"info", "fail", or "pass"',
        title: "Mobile App build done",
        //subtitle: 'Version ',
        message: msg,
        group: 'osx-notifier',
      });

      console.log("App build successful!");
      console.log('ends at '+Moment().format("HH:mm"));
      console.log('');
      console.log("run the command :");
      console.log(msg);
      console.log('');
    }catch(e)
    {//console.log(e);
      errorOnDeploy("Build failed", e.message);
      return;
    }
    
  }
}
function execCmd(cmd){
  console.log(cmd)
      let r = ExecSync(cmd);
      console.log(r.toString());
      console.log('')
}
function errorOnDeploy(title, details){
  Log.displayError(title);
  Log.displayError(details);
  Notifier({
    type: "fail",//"info", "fail", or "pass"',
    title: title,
    //subtitle: 'Version ',
    message: details,
    group: 'osx-notifier',
  });
}