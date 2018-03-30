const InputError = require("../errors/inputError");
const Path = require('path');

module.exports = {
  getPublicDatabaseFolder: function () { return Path.resolve("imports", "database"); },
  getCollFolder: function(dbFolder) { return Path.resolve(dbFolder, "models"); },
  getPubliFolder: function() { return Path.resolve("imports", "server", "database", "publications"); },
  getTplFolder: function(){ return Path.resolve(Path.join(Path.dirname(process.mainModule.filename),'..'), 'tpls'); },
  getSettingsFile: function(env) { return Path.resolve("private", "conf", 'settings.'+env+'.json'); },
  getClientRelPath: function(uitype) { return Path.join("imports", getUiFolderName(uitype)); }
}

function getUiFolderName(uiType){
    if( uiType != "browser" && uiType != "mobile" )
    { throw new InputError("unmanaged ui value : "+uiType); }

    if( uiType == "browser" )
    { return "client"; }

    return "mobile";
}
