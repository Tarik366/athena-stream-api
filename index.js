const express = require('express')
var mysql = require('mysql')
var bodyParser = require('body-parser')
var moment = require('moment')
const app = express()
const port = 3000
const fsPromises = require('fs/promises');

function getNow(){
    var now = moment().format('YYYY-MM-DD HH:MM:ss.SSSS');
    return now;
}

async function writeLog(message, level) {
    try{
        const nowe = new Date();
        await fsPromises.appendFile('./log.txt', `${level}: ${nowe.toLocaleString()} - ${message}\n`, 'utf-8');
    }
    catch(err){
        console.log('Dosya yazdırılırken bir hata oluştu', err)
    }
}
writeLog('Sunucu başlatıldı.', 'info');

var con = mysql.createConnection({
    host: "localhost",
    database: 'athenama_athena_admin_db',
    port: 3306,
    user: "root",
    password: ""
  });


app.get('/', (req, res) => {
    res.send('You\'re not allowed here')
})

app.head('/', (req, res) => {
    res.render(log); // log.jade dosyasını yükler 
})

app.get('/login/:page/:token/:ip/', (req, res) => {
    con.query(`SELECT * FROM logins WHERE token = '${req.params.token}';`, function (err, result, fields) {
        res.send(JSON.stringify(result))
    });
    writeLog(`${req.params.token} ${req.params.page} sayfasına geçti`, 'Sayfa değişimi')
});

app.post('/login/:name/:token/:ip/', (req, res) => {
    var now = getNow();
    // INSERT INTO `logins` (`name`, `token`, `time`, `ip_adress`) VALUES ('tarik', 'aaaaaaaaaaa', '2023-12-21 23:16:41.000000', '46.196.145.149');
    con.query(`INSERT INTO \`logins\` (\`name\`, \`token\`, \`time\`, \`ip_adress\`) VALUES ('${req.params.name}', '${req.params.token}', '${now}', '${req.params.ip}');`, function (err, result, fields) {
        res.send(JSON.stringify(result))     
    });
    writeLog(`${req.params.name}, ${req.params.ip} adresinden ${req.params.token} ile giriş yaptı`, 'Giriş');
})

app.delete('/login', (req, res) => {
    res.send(JSON.stringify({ x: 5, y: 6 }))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})