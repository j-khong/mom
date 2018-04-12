const Path = require("path");
const FS = require("fs");
const Mkdirp = require("Mkdirp");
const ReplaceInFileImport = require("replace");
const ConfError = require("../errors/confError");

module.exports = {
   replaceInFile: function(regex, replace, aFiles) {
      ReplaceInFileImport({
         regex: regex,
         replacement: replace,
         paths: aFiles,
         recursive: true,
         silent: true
      });
   },
   addImportToFile: function(filename, importFile) {
      Mkdirp.sync(Path.dirname(filename));
      var fileContent = "";
      if( FS.existsSync(filename) ) { fileContent = FS.readFileSync(filename, "utf8"); }

      var importDirective = "import './" + importFile + "';\n";
      FS.writeFileSync(filename, importDirective + fileContent, "utf-8");
   },
   appendFileWithFile: function(filenameToAppend, filenameToCopy) {
      if( !FS.existsSync(filenameToCopy) ) { throw new ConfError("missing file " + filenameToCopy); }

      var fileContent = FS.readFileSync(filenameToCopy, "utf8");
      this.appendFileWithText(filenameToAppend, fileContent);
   },
   appendFileWithText: function(filename, text) {
      Mkdirp.sync(Path.dirname(filename));
      var fileContent = "";
      if( FS.existsSync(filename) ) { fileContent = FS.readFileSync(filename, "utf8"); }

      FS.writeFileSync(filename, fileContent + "\n" + text, "utf-8");
   },
   isInFile: function(filename, pattern) {
      const data = FS.readFileSync(filename, "utf8");

      if( data.indexOf(pattern) >= 0 ) { return true; }
      return false;
   }
};

