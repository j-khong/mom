const Fsex = require('fs-extra');
const Fs = require('fs');
const Path = require('path');
const ReadlineSync = require('readline-sync');
const ExecSync = require('child_process').execSync;
const Mkdirp = require('mkdirp');

const InputError = require("./errors/inputError");
const ConfError = require("./errors/confError");
const Settings = require("./helpers/momSettings");
const helpers = require("./helpers/log");
const File = require("./helpers/file");
const Conv = require("./helpers/momConventions");

String.prototype.capitalize = function() {
 return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.decapitalize = function() {
 return this.charAt(0).toLowerCase() + this.slice(1);
}

// ✓ ✗
// TODO consider https://www.npmjs.com/package/shelljs
module.exports = {
  create: function(cliOptions){
    const projectName = cliOptions["name"];
    const projectFolder = Path.resolve(projectName);
    const namespace = cliOptions["ns"];
    var meteorVersion = cliOptions["mv"];
    var desc = cliOptions["desc"];

    var aHeader = [desc,"",
    'project       : '+projectName,
    'namespace     : '+namespace,
    'meteor version: '+meteorVersion];
    console.log(helpers.formatHeader(aHeader));
    console.log('');
    if( "Y" != ReadlineSync.question('continue? Y/n : ') ){return;}
  
    if( Fs.existsSync(projectFolder) ){
      throw new InputError("Folder ["+projectFolder+"] already exists");
    }

    console.log("Creating the project ...");

    /**/
    code = ExecSync('meteor --release ' + meteorVersion + ' create --bare ' + projectName);
    console.log(code.toString())
    
    /*
    p = Path.resolve(projectFolder, '.meteor');
    Mkdirp.sync(p)
    */

    Settings.createMomFolder(projectFolder, namespace);
    
    var tplsFolder = Conv.getTplFolder();

    code = ExecSync('cd '+ projectFolder
      + ' && cp -fr ' + Path.resolve(tplsFolder, 'create/*') + " ."
      + ' && cp ' + Path.resolve(tplsFolder, 'packages') + " .meteor/"
    );
    //console.log(code.toString())
    console.log("\n\nTo use your dev settings file, use this command : meteor npm run dev (instead of the plain : meteor)\n\n");

    var imports = Path.resolve(projectFolder, 'imports');
    File.replaceInFile("NamespaceToReplace", namespace, 
      [Path.join(imports, 'common', '_base.js'),
      Path.join(imports, "client", 'controllers', '_base.js'),
      Path.join(imports, 'database', "models", '_base.js')]);

    File.replaceInFile("PRJNAME", projectName, [Path.resolve(projectFolder, 'package.json')]);
    Fs.renameSync(
      Path.resolve(projectFolder, "NS.sublime-project"),
      Path.resolve(projectFolder, namespace+".sublime-project"));


    console.log("Adding npm deps ...")
    code = ExecSync('cd '
      + projectFolder
      + ' && meteor npm install');
      console.log(code.toString())

    //setenv("dev", projectName);
    console.log("Project created !!!")
    console.log("");
    console.log("So now, do : cd "+projectFolder+" && meteor npm run dev\n");

  },
  momify: function(cliOptions){
    //check .meteor is there
    var currentFolder = process.cwd();
    if( !Fs.existsSync(Path.join(currentFolder, '.meteor')))
    { throw new ConfError("can't momify!!! please get to the top level folder of your meteor project (where .meteor is)"); }

    console.log("nothing done : function to be refactored");
    return;

    // get project name
    var projectName = Path.basename(currentFolder);
    var namespace = cliOptions["ns"];
    var desc = cliOptions["desc"];
    var aHeader = [desc,"",
    'project       : '+projectName,
    'namespace     : '+namespace];
    console.log(helpers.formatHeader(aHeader));
    console.log('');
    if( "Y" != ReadlineSync.question('continue? Y/n : ') ){return;}

    Settings.createMomFolder(currentFolder, namespace);

    console.log("Project momified !!!");
  },
  addTemplate: function(cliOptions){
    var conf = Settings.getProjectConf();
    
    var templateName = String(cliOptions["name"]).capitalize();
    var uiType = String(cliOptions["ui"]).toLowerCase();

    var clientRelPath = Conv.getClientRelPath(uiType);
    var relativePathFromClientRouter = Path.join("ui", "pages");
    var folder = Path.join(clientRelPath, relativePathFromClientRouter);
    var desc = cliOptions["desc"];
  
    var html = Path.resolve(folder, templateName+".html");
    var js = Path.resolve(folder, templateName+".js");

    if( Fs.existsSync(html) )
    { throw new InputError("File ["+html+"] already exists"); }
    if( Fs.existsSync(js) )
    { throw new InputError("File ["+js+"] already exists"); }

    var aHeader = [desc,"",
    'template name: '+templateName,
    'folder       : '+folder];
    console.log(helpers.formatHeader(aHeader));
    console.log('');
    if( "Y" != ReadlineSync.question('continue? Y/n : ') ){return;}
    
    var tplsFolder = Path.join(Conv.getTplFolder(), "addtpl");
    Fsex.copySync(Path.join(tplsFolder, "template.html"), html);
    Fsex.copySync(Path.join(tplsFolder, "template.js"), js);

    File.replaceInFile("tplname", templateName, [html, js]);

    var clientRouterFilename = Path.resolve(clientRelPath, "router.js");
    File.addImportToFile(clientRouterFilename, Path.join(relativePathFromClientRouter, templateName + ".js"));

    // routing code
    File.appendFileWithFile(clientRouterFilename, Path.join(tplsFolder, "routerCodeToAppend.js"));
    File.replaceInFile("ROUTENAME", templateName.toLowerCase(), [clientRouterFilename]);
    File.replaceInFile("ROUTECALLNAME", templateName.toLowerCase(), [clientRouterFilename]);
    File.replaceInFile("TPLNAME", templateName, [clientRouterFilename]);

    console.log("Template "+templateName+" is added !!!");
  },
  addCollection: function(cliOptions) 
  {
    var conf = Settings.getProjectConf();

    var entry = String(cliOptions["name"]);
    var type = String(cliOptions["type"]);
    var schema = String(cliOptions["schema"]).split(" ");
    
    if( type != "public" && type != "private" ){ throw new InputError("unmanaged type "+type); }
    checkSchemaValues(schema);

    var collFileName = entry.decapitalize();
    var collNS = entry.capitalize();
    var collectionName = entry.toLowerCase();

    var databaseFolder = Conv.getPublicDatabaseFolder();
    var pathToMixin = ".";
    var pathToBase = ".";
    if( "private" == type )
    { 
      databaseFolder = Path.resolve("imports", "server", "database");
      pathToMixin = Path.join("..", "..", "database");
      pathToBase = Path.join("..", "..", "..", "database", "models");
    }

    var collFolder     = Conv.getCollFolder(databaseFolder);
    var publiFolder    = Conv.getPubliFolder();

    var destDBFilename    = Path.join(databaseFolder, collFileName + ".js");
    var destModelFilename = Path.join(collFolder, collFileName + ".js");
    var destPubFilename   = Path.join(publiFolder, collFileName + ".js");

    if( "server" == collectionName || "client" == collectionName )
    { throw new InputError("You can't name a collection with this keyword"); }

    if( Fs.existsSync(destDBFilename) ||
        Fs.existsSync(destModelFilename) ||
        Fs.existsSync(destPubFilename) )
    { throw new InputError("The collection already exists"); }

    var desc = cliOptions["desc"];

    var aHeader = [desc,"",
    'collection file name    : ' + collFileName,
    'collection namespace    : ' + collNS,
    'collection name in mongo: ' + collectionName,
    '=> ex. of use : ' + conf.namespace + ".Database." + collNS];
    console.log(helpers.formatHeader(aHeader));
    console.log('');
    if( "Y" != ReadlineSync.question('continue? Y/n : ') ){return;}

    var tplsFolder = Path.join(Conv.getTplFolder(), "addcoll");

    Mkdirp.sync(collFolder);
    Mkdirp.sync(publiFolder);

    // copy file while renaming
    Fsex.copySync( Path.join(tplsFolder, "database.js"), destDBFilename );
    Fsex.copySync( Path.join(tplsFolder, "model.js"), destModelFilename );

    var filesList = [destDBFilename, destModelFilename];
    if( "public" == type ) { 
      Fsex.copySync( Path.join(tplsFolder, "publi.js"), destPubFilename );
      filesList.push(destPubFilename);
    }

    // replace values in files 
    File.replaceInFile("GlobalNS", conf.namespace, filesList);
    File.replaceInFile("collNSlower", collectionName, filesList);
    File.replaceInFile("collNS", collNS, filesList);
    File.replaceInFile("collName", collFileName, filesList);
    File.replaceInFile("PATHTOMIXIN", pathToMixin, filesList);
    File.replaceInFile("PATHTOBASE", pathToBase, filesList);
    generateSchema(destModelFilename, schema);
  
    if( "public" == type ) {
      // add imports
      File.addImportToFile(
        Path.join(databaseFolder, "_imports.js"),
        collFileName + ".js");

      File.addImportToFile(
        Path.join(publiFolder, "_imports.js"),
        collFileName + ".js");
    }

    console.log("Collection "+ collectionName +" is added !!!");
  },
  addUsers: function(cliOptions)
  {
    var conf = Settings.getProjectConf();

    var uiType = String(cliOptions["ui"]).toLowerCase();
    var clientRelPath = Conv.getClientRelPath(uiType);

    var desc = cliOptions["desc"];
    var aHeader = [desc,"",
    'ui type   : ' + uiType,
    'ui folder : ' + clientRelPath];
    console.log(helpers.formatHeader(aHeader));
    console.log('');
    if( "Y" != ReadlineSync.question('continue? Y/n : ') ){return;}

//TODO-MoM check module pas deja ajouté => check prjconf??

    var tplFolder = Path.join(Conv.getTplFolder(), "addusers");

    // add needed packages
    File.appendFileWithFile(Path.resolve(".meteor", "packages"), Path.join(tplFolder, "packages"));

    //
    // client files
    //
    // add pages / templates
    var tplUiRelPath = Conv.getClientRelPath("browser");
    var pagesRelPath = Path.join(clientRelPath, "ui", "pages" );
    Fsex.copySync( Path.join(tplFolder, tplUiRelPath, "ui", "pages" ), Path.resolve(pagesRelPath) );
    // account settings
    Fsex.copySync( Path.join(tplFolder, tplUiRelPath, "accounts.js" ), Path.resolve(clientRelPath, "accounts.js") );
    File.addImportToFile( Path.resolve(clientRelPath, "index.js"), "accounts.js");

    // routing code
    File.appendFileWithFile(Path.resolve(clientRelPath, "router.js"), Path.join(tplFolder, tplUiRelPath, "routerCodeToAppend.js"));


    //
    // configuration files
    //
    // add email tpl
    var emailsSubFolders = Path.join("private", "email", "tpl" );
    Fsex.copySync( Path.join(tplFolder, emailsSubFolders ), Path.resolve(emailsSubFolders) );

    // social config
    var serverRelPath = Path.join("imports", "server");
    var socialFilename = "social-config.js";
    var socialRelFilename = Path.join(serverRelPath, socialFilename);
    Fsex.copySync( Path.join(tplFolder, socialRelFilename), Path.resolve(socialRelFilename) );
    File.addImportToFile(Path.resolve(serverRelPath, "index.js"), socialFilename);

    // add new fields to json conf files
    var envs = ["dev", "prx", "prd"];
    envs.forEach((env)=>{
      // load the file in var
      var filename = Conv.getSettingsFile(env);
      var jsonFile = require(filename);
      // add new fields
      jsonFile.private.facebook = {
        appId: "",
        secret: ""
      };
      jsonFile.private.email = {
        titlePrefix: "[your business name]",
        signature: "your signature",
        website: "website.fr",
        firstname: "your firstname",
        smtp: {
          username: "",
          password: "",
          server:   "",
          port: 587
        }
      };
      // save to file
      Fs.writeFile(filename, JSON.stringify(jsonFile, null, 3), "utf-8", (err, res)=>{});
    })

    // account settings
    var serverAccountsFile = Path.resolve(serverRelPath, "accounts.js");
    var serverFile = Path.resolve(serverRelPath, "index.js");
    Fsex.copySync( Path.join(tplFolder, serverRelPath, "accounts.js" ), serverAccountsFile );
    File.addImportToFile(serverFile , "accounts.js");
    var serverAnchor = "/// AUTOMATIC INSERTS ANCHOR";
    File.replaceInFile(serverAnchor, serverAnchor+"\n  RedefineAccountsRoutes();", [serverFile]);

    // add colls
    var tplCollFolder = Path.join(tplFolder, "coll");
    var destDBFilename = Path.join(Conv.getPublicDatabaseFolder(), "user.js");
    var destModelFilename = Path.join(Conv.getCollFolder(Conv.getPublicDatabaseFolder()), "user.js");
    var destPubliFilename = Path.join(Conv.getPubliFolder(), "user.js");

    Fsex.copySync( Path.join(tplCollFolder, "database.js"), destDBFilename );
    Fsex.copySync( Path.join(tplCollFolder, "model.js"), destModelFilename );
    Fsex.copySync( Path.join(tplCollFolder, "publi.js"), destPubliFilename );

    File.replaceInFile("GlobalNS", conf.namespace, [destDBFilename, destModelFilename, destPubliFilename, serverAccountsFile,
      Path.resolve(pagesRelPath, "Login.js"), Path.resolve(pagesRelPath, "Profile.js")]);

    File.addImportToFile( Path.join(Conv.getPublicDatabaseFolder(), "_imports.js"), "user.js");
    File.addImportToFile( Path.join(Conv.getPubliFolder(), "_imports.js"), "user.js");


    
/*

######
// TODO-MOM
add to imports/startup/server/settings.dev.js
process.env.MAIL_URL = 'smtp://julienkhong%40yahoo.fr:uhyfxqueztqkawrr@smtp.mail.yahoo.com:587';
######
*/

    console.log("users are now managed!")

  },
  createuc: function(cliOptions){
    var events = ["form submission", ""];
    var controllers = Fs.readdirSync(Path.join("imports/controllers")).filter(name => (name.charAt(0) != ".") && (name.charAt(0) != "_") );
    var tables = Fs.readdirSync(Path.join("imports/database")).filter(name => (name.charAt(0) != ".") && (name.charAt(0) != "_") );

    console.log("A use case is a series of event to which the program reacts.")
    console.log("")
  }
}

function checkSchemaValues(schemaValues){
    var uniqueKeyFields = [];
    schemaValues.forEach((fieldDef)=>{
        var split = fieldDef.split(":");
        if( split.length < 2 ){ throw new InputError("a schema data field must be declared as this \"name:type\""); }
        var name = split[0];
        var type = split[1];
        var val = split[2];
        if( type != "Number" && type != "String" && type != "Date" ){ throw new InputError("unknown type "+ type); }
        if (null != val && val == "unique") {uniqueKeyFields.push(name);}
    });

    if( uniqueKeyFields.length == 0 ){ throw new InputError("you must declare at least one schema data field to be the unique key as this \"fieldName:type:unique\""); }

}
function generateSchema(modelFile, schema){
    var strSchema = "";var strMethods = "";
    var uniqueKeyFields = [];
    schema.forEach((fieldDef)=>{
        var split = fieldDef.split(":");
        var name = split[0];
        var type = split[1];
        var val = split[2];
        if (null != val && val == "unique") {uniqueKeyFields.push(name);}
        strSchema += "  "+name+": {type: "+type+"},\n";
        strMethods += "  get"+name.capitalize()+"() { return this.data."+name+"; }\n";
    });
    if( strSchema != "" ){ strSchema = strSchema.slice(0,strSchema.length-2); }
    
    var indent = "  ";
    //strMethods += indent+"getKey("+uniqueKeyFields.join(', ')+"){ return {";
    strMethods += indent+"getKey(){ return {";
    uniqueKeyFields.forEach((field)=>{
        strMethods += field+":this.data."+field+", ";
    });
    strMethods = strMethods.slice(0,strMethods.length-2);
    strMethods += "}; }";

    File.replaceInFile("  /// AUTOMATIC INSERTS SCHEMA ANCHOR", strSchema, [modelFile]);
    File.replaceInFile("  /// AUTOMATIC INSERTS METHODS ANCHOR", strMethods, [modelFile]);
}

/* for future payment module
jsonFile.private.email = {
  "stripe": {
    "secretKey": ""
  }
};
jsonFile.public.email = {
  "stripe": {
    "publishableKey": ""
  },
  "paymentStub": true,
};
*/

/*
TODO-MOM conf to add later

// process.env.MAIL_URL = getMailUrl();
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
*/