const fs = require('fs');

var SaveData = {
    save: function(fileName, strData) {
        let fd;
        try {
            fd = fs.openSync('data/'+fileName, 'a');
            fs.appendFileSync(fd, strData+'\n', 'utf8');
        } catch (err) {
            console.log("写入失败");
            /* Handle the error */
        } finally {
          if (fd !== undefined)
            fs.closeSync(fd);
        }
    },
}
module.exports = SaveData;
