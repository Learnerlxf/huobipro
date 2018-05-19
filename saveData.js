const fs = require('fs');
const mysql = require('mysql');


var mysqlPool  = mysql.createPool({  
  connectionLimit : 10,  
  host            : '172.96.204.159',  
  user            : 'root',  
  password        : '123456',  
  database        : 'huobipro'  
}); 

var SaveData = {
    save: function(fileName, strData) {
        // let fd;
        // try {
        //     fd = fs.openSync('data/'+fileName, 'a');
        //     fs.appendFileSync(fd, strData+'\n', 'utf8');
        // } catch (err) {
        //     console.log("写入失败");
        //     /* Handle the error */
        // } finally {
        //   if (fd !== undefined)
        //     fs.closeSync(fd);
        // }
        this.insert(fileName, strData);
    },
    query : function(sql, callback){  
        if (!sql) {  
            callback('no sql');  
            return;  
        }  
        //console.log("mysqlPool", mysqlPool);
        mysqlPool.query(sql, function(err, rows, fields) {  
          if (err) {  
            console.log(err);  
            callback(err, null);  
            return;  
          };  
          callback(null, rows, fields);  
        });  
    },
    insert : function(tableName, value){  
        tableName = tableName.replace(/\./g, "_");
        if (!tableName || tableName=="") {return}
        let sql = 'create table if not exists '+tableName+" (id int primary key not null auto_increment,value text)";
        mysqlPool.query(sql, (err, rows, fields)=> {
            sql = "insert into "+tableName+" (value) value ('"+value+"')";
            this.query(sql, ()=>{});
        });  
    }
}
module.exports = SaveData;
