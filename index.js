var express = require("express");
var app = express();
var engines = require('consolidate');
var sqlite = require('sqlite3');
var db = new sqlite.Database("encuestas.db");
var main = require('./controllers/main')(db);
var materias = require('./controllers/materias')(db);

app.use('/css', express.static(__dirname + '/css'));
app.use('/fotos', express.static(__dirname + '/fotos'));
app.use(express.cookieParser());
app.use(express.session({'secret': "parrilla"}));
app.use(express.logger("dev"));

app.set('view engine', 'html');
app.engine('html', engines.handlebars);

app.get('/', main.showMateriasRegulares);
app.get('/materia/:id', materias.showMateria);

app.listen(3000);