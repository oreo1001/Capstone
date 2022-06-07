const express = require('express');
const app = express();
const session = require('express-session');
const fs = require('fs');
const mysql = require('mysql');
const cors = require('cors');
const fileUpload =require('express-fileupload');

app.use(cors());
app.use(express.static('public'));
app.use(fileUpload());
app.post('/api/upload',(req,res)=>{
  if (!req.files) {
    return res.status(500).send({ msg: "file is not found" })
  }
    // accessing the file
  const myFile = req.files.file;

  //  mv() method places the file inside public directory
  myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
      if (err) {
          console.log(err)
          return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({name: myFile.name, path: `/${myFile.name}`});
  });
  database = fs.readFileSync(`./public/${myFile.name}`);
  data1 = JSON.parse(database.toString());
  //console.log(data1);
  list1 = myFile.name.split('.');
  str1 = "`" + list1[0] + "`";
  //console.log(list1[0]);
  conn.query(`create table IF NOT EXISTS ${str1} (col JSON)`,function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows.insertId);
    }
  });
  const ssql = `INSERT INTO ${str1} VALUES(?)`;
  const param = JSON.stringify(data1);
  conn.query(ssql,param,function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows.insertId);
    }
  });
})

app.use(session({
    secret: 'secret code',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 //쿠기 유효시간 1시간
}
}));
const sql = require('./sql.js');
const server = app.listen(3000,()=>{
    console.log('Server started. port 3000.');
});

const conn = mysql.createConnection({
  database: "test",
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  port : 3307,
  password: "my_new_password"
});
/*
//table create
conn.query("create table IF NOT EXISTS `etu-25-ge`(col JSON)",function(err,rows,fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows.insertId);
  }
});
// table insert 
const ssql = 'INSERT INTO `etu-25-ge` VALUES(?)';
const param = JSON.stringify(data1);
conn.query(ssql,param,function(err,rows,fields){
  if(err){
    console.log(err);
  }
  else{
    console.log(rows.insertId);
  }
});

/* 비동기 쓰일일 있으면
app.get('/api/info',async (req,res)=>{
  //console.log(req.body);
  try{
    res.send(await dbData);
  }catch(err){
    res.status(500)
  }
});
*/
app.get('/api/',function (req,res){
  conn.query('show tables from test;',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const result = JSON.parse(JSON.stringify(rows));
      //console.log(result);
      const list3=[];
      for(key in result){
        list3.push(result[key].Tables_in_test);
      }
      //console.log(list3);
      res.send(list3);
    }
  });
});

app.get('/api/info:id',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      //console.log(dbData);
      res.send(dbData.info);
    }
  });
});

app.get('/api/relay',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      res.send(dbData.relay);
    }
  });
});

app.get('/api/alarm:id',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      res.send(dbData.alarm);
    }
  });
});

app.get('/api/setting:id',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      res.send(dbData.setting);
    }
  });
});

app.get('/api/measure',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      res.send(dbData.measure);
    }
  });
});

app.get('/api/event',function (req,res){
  conn.query('select * from test',function(err,rows,fields){
    if(err){
      console.log(err);
    }
    else{
      const dbData = JSON.parse(rows[0].col);
      res.send(dbData.event);
    }
  });
});