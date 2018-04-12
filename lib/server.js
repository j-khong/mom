const Notifier = require("osx-notifier");
const ExecSync = require("child_process").execSync;
const Moment = require("moment");
const SCP = require("scp");
const Path = require("path");
const FS = require("fs");
const ReadlineSync = require("readline-sync");
const Settings = require("./helpers/momSettings");
const Log = require("./helpers/log");
const Conv = require("./helpers/momConventions");
const ConfError = require("./errors/confError");
const File = require("./helpers/file");

module.exports = {
   deploy: function(cliOptions) {

      var env = cliOptions["env"];
      var envfile = Conv.getSettingsFile(env);
      if( !FS.existsSync(envfile) ) { throw new ConfError("conf file " + envfile + " is missing"); }

      var prjConf = Settings.getProjectConf();
      var serverConf = Settings.getServerConf(env);
      if( !serverConf ) {
         var aHeader = ["you have not configured your server for env " + env + ", let's do that!"];
         console.log(Log.formatHeader(aHeader));
         console.log("");
         var ip = ReadlineSync.question("what is the server ip? : ");
         var user = ReadlineSync.question("what is the server user? : ");
         var tld = ReadlineSync.question("what is the top level domain name? : ");
         var port = ReadlineSync.question("which port to expose? : ");
         console.log("thanks very much, i'm saving these precious data...");
         console.log("");

         serverConf = Settings.saveServerConf(env, ip, user, tld, port);
      }
      var currentVersion = require(Path.resolve("package.json")).version;
      var currentversionFilename = "currentversion";
      var localCurrentVersionFile = "/tmp/" + currentversionFilename;

      var serverTargetFolder = Path.join(serverConf.installFolder, prjConf.name);
      if( "prx" == env ) { serverTargetFolder += "-prx"; }
      var conn = serverConf.user + "@" + serverConf.ip;
      try {
         var r = ExecSync("ssh " + conn + " \"ls " + serverTargetFolder + "\"");
         //console.log(r.toString())
      } catch( e ) {//console.log(e);
         //throw new ConfError("The project is not set up on the server, please use MoM setupapp");
         console.log("The project is not set up on the server");
         console.log("Setting it up...");
         try {
            var r = ExecSync("ssh " + conn + " \"mkdir " + serverTargetFolder
               + " && cd " + serverTargetFolder
               + " && mkdir config tmp versions"
               + " && cd config && ln -s ../current/env.list env.list\"");
            //console.log(r.toString())
            console.log("Done!");
            console.log("");
         } catch( e ) {
            throw new ConfError("Fail to set up the project on the server, please do it manually");
         }
      }

      // checking server set up
      var options = {
         file: serverTargetFolder + "/" + currentversionFilename,
         user: serverConf.user,
         host: serverConf.ip,
         port: "22",
         path: localCurrentVersionFile
      };

      // get install version on the server
      console.log("getting version installed on server...");
      SCP.get(options, function(err) {
         var vServer = "the project is set up but it is the first install";
         if( !err ) {
            //console.log("ok")
            vServer = FS.readFileSync(localCurrentVersionFile, "utf8").trim();
            if( currentVersion == vServer ) // TODO split version and compare greater or not
            {
               Log.displayError("The version you want to build (" + currentVersion + ") is already installed on the server");
               return;
            }
         }
         console.log("");

         // display header
         var aHeader = [
            "Project            : " + prjConf.name,
            "Version to install : " + currentVersion,
            "",
            "Conn               : " + conn,
            "Env                : " + env,
            "Install folder     : " + serverTargetFolder,
            "Version on server  : " + vServer
         ];
         console.log(Log.formatHeader(aHeader));
         console.log("");
         if( "Y" != ReadlineSync.question("continue? Y/n : ") ) {return;}
         console.log("");

         const androidPlatform = "android";
         const platformFile = Path.resolve(".meteor", "platforms");
         const hasAndroid = File.isInFile(platformFile, androidPlatform);
         if( hasAndroid ) {File.replaceInFile(androidPlatform, "", [platformFile]);}

         // build
         var start = Moment().format("HH:mm");
         console.log("build starts at " + start);

         var projectFolderPath = Path.resolve();
         var buildFolder = prjConf.name + "-build";
         try {
            var r = ExecSync("cd " + projectFolderPath
               + " && rm -fr " + buildFolder
               + " && meteor build --architecture=os.linux.x86_64 " + buildFolder);
            //console.log(r.toString())
         } catch( e ) {//console.log(e);
            errorOnDeploy("Build failed", e.message);
            return;
         } finally {
            if( hasAndroid ) {File.appendFileWithText(platformFile, androidPlatform);}
         }
         console.log("build ends at " + Moment().format("HH:mm"));
         console.log("");
         //
         // create additional files
         var upVersionFile = Path.resolve(buildFolder, "versiontoinstall");
         FS.writeFileSync(upVersionFile, currentVersion + "\n", "utf-8");
         // create env.list file
         var upAppConfFile = Path.resolve(buildFolder, "env.list");
         createAppConfFile(upAppConfFile, envfile, serverConf);

         //
         // uploading files
         var upDestFolder = Path.join(serverTargetFolder, "tmp");
         var upAppBundle = Path.resolve(buildFolder, prjConf.name + ".tar.gz");
         var upAppBundleSize = Math.round(FS.statSync(upAppBundle).size / 1000000.0);// 1024 / 1024;

         console.log("transfering tar v." + currentVersion + " of size " + upAppBundleSize + "Mb to server folder " + upDestFolder);
         console.log("starts at " + Moment().format("HH:mm"));
         options.file = upAppBundle;
         options.path = Path.join(upDestFolder, "bundle." + currentVersion + ".tar.gz");
         SCP.send(options, function(err) {
            if( err ) {
               errorOnDeploy("Pkg upload failed", err);
               return;
            }
            console.log("ends at " + Moment().format("HH:mm"));
            console.log("");

            options.file = upVersionFile;
            options.path = serverTargetFolder;
            SCP.send(options, function(err) {
               if( err ) {
                  errorOnDeploy("Version file upload failed", err);
                  return;
               }

               options.file = upAppConfFile;
               options.path = upDestFolder;
               SCP.send(options, function(err) {
                  if( err ) {
                     errorOnDeploy("App conf file upload failed", err);
                     return;
                  }

                  r = ExecSync("cd " + projectFolderPath + " && rm -fr " + buildFolder);

                  var end = Moment().format("HH:mm");
                  console.log("");
                  var success = "Meteor Deployment done!";
                  console.log(success);
                  console.log("at " + end);
                  Notifier({
                     type: "pass",//"info", "fail", or "pass"',
                     title: success,
                     //subtitle: 'Version ',
                     message: start + " -> " + end,
                     group: "osx-notifier"
                  });
               });// env.list
            });// currentversion
         });// app pkg
      });// get installed version
   }
};

function errorOnDeploy(title, details) {
   Log.displayError(title);
   Notifier({
      type: "fail",//"info", "fail", or "pass"',
      title: title,
      //subtitle: 'Version ',
      message: details,
      group: "osx-notifier"
   });
}

function createAppConfFile(pkgAppConfFile, envfile, serverConf) {
   // inline file content
   var c = FS.readFileSync(envfile, "utf8");
   var arr = c.split("\n").map((v) => {return v.trim();});
   var inline = arr.join("");

   var content = "ROOT_URL=http://" + serverConf.tld + "\n" +
      "METEOR_SETTINGS=" + inline + "\n" +
      "CLUSTER_ENDPOINT_URL=http://" + serverConf.ip + ":80";

   FS.writeFileSync(pkgAppConfFile, content + "\n", "utf-8");

// # NE PAS EFFACER CES INFOS
// # todo upload file env.list (cf apres) to config
//  # => attention a celui-là : si ont met une adresse ip, surtout ne pas oublier le http:// avant
//  # => si choix de l'ip, la connexion FB ne marchera pas (FB demande un domaine comme vpsXXXXXX.ovh.net)
//   # ROOT_URL=http://ndd.com
//   # METEOR_SETTINGS={"public":{}}
//   # CLUSTER_ENDPOINT_URL=http://vpsXXXXXX.ovh.net:80
}