const Fs = require('fs');
const Mkdirp = require('mkdirp');
const Path = require('path');

const ConfError = require("../errors/confError");
const settingsFilename = "project.json";

module.exports = {
  getProjectConf: function(){
    return getConf().project;
  },
  getServerConf: function(env){
    var server = getConf().server;
    if( server ){ return server[env]; }
    return null;
  },
  getAndroidConf: function(){
    return getConf().android;
  },
  createMomFolder: function(projectFolder, namespace){
    var pkgFile = Path.join(Path.dirname(process.mainModule.filename),'..', 'package.json');
    var pjson = require(pkgFile);
    
    var conf = {
      momVersion: pjson.version,
      project: {
        name: Path.basename(projectFolder),
        namespace: namespace
      }
    }
    saveConf(conf, projectFolder);
  },
  saveServerConf: function(env, ip, user, tld, port){
    var serverEnvConf = {
      ip: ip,
      user: user,
      tld: tld, 
      port: port,
      installFolder: "/opt"
    };
    var conf = getConf();
    if(!conf.server){ conf.server = {}; }
    conf.server[env] = serverEnvConf;
    saveConf(conf, ".");
    return serverEnvConf;
  },
  saveAndroidConf: function(keystoreFolder, keystorePwd, keystoreName, keystoreAlias){
    var androidConf = {
      keystore: {
        folder: keystoreFolder,
        pwd: keystorePwd,
        name: keystoreName,
        alias: keystoreAlias
      }
    };
    var conf = getConf();
    conf.android = androidConf;
    saveConf(conf);
    return androidConf;
  },
  saveAndroidDeliveryConf: function(path){
    var conf = getConf();
    conf.android.delivery = {
      folder: path
    };
    saveConf(conf);
    return conf.android.delivery;
  }
}

function saveConf(conf, projectFolder = "."){
  var p = Path.resolve(projectFolder, '.mom');
  Mkdirp.sync(p)

  Fs.writeFileSync(Path.resolve(p, settingsFilename), JSON.stringify(conf, null, 3), "utf-8");
}
function getConf(){
  var file = Path.resolve(".mom", settingsFilename);
  if( !Fs.existsSync(".mom") || !Fs.existsSync(file) ){
    throw new ConfError("This is not a MoM project or you are not at the top level folder of it");
  }
  return JSON.parse(Fs.readFileSync(file, 'utf8'));
}