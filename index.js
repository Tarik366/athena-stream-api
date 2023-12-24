require('dotenv').config()
const express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var moment = require('moment')
const app = express()
const port = process.env.port;
const fsPromises = require('fs/promises');
const pug = require("pug");

function getNow(){
    var now = moment().format('YYYY-MM-DD HH:MM:ss.SSSS');
    return now;
}

async function writeLog(message, level) {
    try{
        const nowe = new Date();
        await fsPromises.appendFile('views/log.', `${level}: ${nowe.toLocaleString()} - ${message}\n`, 'utf-8');
    }
    catch(err){
        console.log('Dosya yazdırılırken bir hata oluştu', err)
    }
}
writeLog('Sunucu başlatıldı.', 'info');

var con = mysql.createConnection({
    host: process.env.host,
    database: process.env.db,
    port: process.env.dbport,
    user: process.env.user,
    password: process.env.ps
  });

app.get('/api', (req, res) => {
    res.send(pug.renderFile("log.pug")); // log.jade dosyasını yükler 
})

app.get('/api/login/:page/:token/:ip/', (req, res) => {
    con.query(`SELECT * FROM logins WHERE token = '${req.params.token}';`, function (err, result, fields) {
        res.send(JSON.stringify(result))
    });
    writeLog(`${req.params.token} ${req.params.page} sayfasına geçti`, 'Sayfa değişimi')
});

app.post('/api/login/:name/:token/:ip/', (req, res) => {
    var now = getNow();
    // INSERT INTO `logins` (`name`, `token`, `time`, `ip_adress`) VALUES ('tarik', 'aaaaaaaaaaa', '2023-12-21 23:16:41.000000', '46.196.145.149');
    con.query(`INSERT INTO \`logins\` (\`name\`, \`token\`, \`time\`, \`ip_adress\`) VALUES ('${req.params.name}', '${req.params.token}', '${now}', '${req.params.ip}');`, function (err, result, fields) {
        res.send(JSON.stringify(result))     
    });
    writeLog(`${req.params.name}, ${req.params.ip} adresinden ${req.params.token} ile giriş yaptı`, 'Giriş');
})

app.delete('/api/login', (req, res) => {
    res.send(JSON.stringify({ x: 5, y: 6 }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})