var fs = require("fs");

console.log("Going to delete directory /tmp/test");
fs.rmdir("test",function(err){
   if (err) {
       return console.error(err);
   }
   console.log("Going to read directory /home");
   fs.readdir("/home/alan_flores/node/",function(err, files){
      if (err) {
          return console.error(err);
      }
      files.forEach( function (file){
          console.log( file );
      });
   });
});
