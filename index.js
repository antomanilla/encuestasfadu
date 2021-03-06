var express = require("express");
var app = express();
var engines = require('consolidate');
var sqlite = require('sqlite3');
var db = new sqlite.Database("encuestas.db");
var main = require('./controllers/main')(db);
var materias = require('./controllers/materias')(db);
var optativas = require('./controllers/optativas')(db);
var catedras = require('./controllers/catedras')(db);
var buscador = require('./controllers/buscador')(db);
var niveles = require('./controllers/niveles')(db);


app.use('/css', express.static(__dirname + '/css'));
app.use('/imagenes', express.static(__dirname + '/imagenes'));
app.use('/js', express.static(__dirname + '/js'));

app.use(express.cookieParser());
app.use(express.session({'secret': "parrilla"}));
app.use(express.logger("dev"));
app.use(express.bodyParser({uploadDir:'/tmp'}));
app.use(app.router);

app.set('view engine', 'html');
app.engine('html', engines.handlebars);

app.get('/', main.showMateriasRegulares);
app.get('/materia/:id', materias.showMateria);
app.get('/optativas', optativas.showOptativas);
app.get('/materia/:id/:catedra', catedras.showCatedra);
app.get('/buscador', buscador.showResults);
app.get('/nivel/:num', niveles.showNivel);
app.post('/materia/:id/:catedra', catedras.uploadReview);
app.listen(3000);