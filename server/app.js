const express = require("express");
const mysql = require("mysql2");
const multer = require('multer')
const path = require('path'); // Додаємо імпорт модуля path
const fs = require('fs');
const jsonParser = express.json();
const app = express();

/////////Робота з загрузкою фото
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `img/${file.originalname}`);
  },
});
const multerFilter = (req, file, cb) => {
    console.log(file.mimetype)
  if (file.mimetype.split("/")[1] === "png" ||  file.mimetype.split("/")[1] === "jpg" ||  file.mimetype.split("/")[1] === "jpeg" ||  file.mimetype.split("/")[1] === "gif" ) {
    cb(null, true);
  } 
  else {
    cb(new Error("Not a PDF File!!"), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "easygift",
  password: "1111"
});
/////////Підключення Бази даних

connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });



/////////Налаштування доступів
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
/////////GET запроси
app.get("/gift", function(request, response){
  connection.query("SELECT * FROM gift", function(err, results, fields) {
    if (err) console.log(err);
    response.send(results);
});    
});

app.get("/imgfoto/:name", function(request, response){

  let name = request.params.name
  let root = path.join(__dirname, 'img/')
  response.sendFile(root+name)
;})
/////////POST запроси
app.post("/addgift",jsonParser,  function(request, response){
  if(!request.body) return response.sendStatus(400);
    let obj = request.body;
    const print = [obj.name, obj.opis, obj.img, obj.price, obj.category, obj.from_gift, obj.type];
    const sql = "INSERT INTO gift(name, opis, img, price, category, from_gift, type) VALUES(?,?,?,?,?,?,?)";
    connection.query(sql, print, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
    });
});

app.post("/update_gift", jsonParser, function(request, response){
  if(!request.body) return response.sendStatus(400);
    let obj = request.body; 
    const print = [obj.marka_print,obj.model_print,obj.info_print,obj.id];
    const sql = "UPDATE list_data SET marka_print=?, model_print=?, info_print=?  WHERE id=?";
    connection.query(sql, print, function(err, results) {
        if(err) console.log(err);
        else console.log("Данные добавлены");
    });
});

app.post("/newimg",upload.single("avatar"), function(request, response){
    console.log(request.file, request.body)
    response.send({code:200})
    
});

  

app.listen(3001);