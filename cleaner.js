// Description: Deletes files older than 30min from the downloads folder

const fs = require('fs');
const jetpack = require('fs-jetpack');
const path = require('path');

function cleaner(type) {
  if (type === 'audio') {
    var uploadsDir = __dirname + '/public/downloads/audio/'
  }
  if (type === 'video') {
    var uploadsDir = __dirname + '/public/downloads/video/'
  }

  if (fs.existsSync(uploadsDir)) {
    fs.readdir(uploadsDir, function (err, files) {
      files.forEach(function (file, index) {
        fs.stat(path.join(uploadsDir, file), function (err, stat) {
          var endTime, now;
          if (err) {
            return console.error(err);
          }
          now = new Date().getTime();
          endTime = new Date(stat.ctime).getTime() + 900000;
          if (now > endTime) {
            return jetpack.removeAsync(path.join(uploadsDir, file)).then(function () {
              return console.log('successfully deleted');
            }).catch(function (err) {
              return console.error('error occurred: ' + err);
            });
          }
        });
      });
    });
  }
}

module.exports = cleaner;