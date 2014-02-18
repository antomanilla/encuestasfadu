var express = require("express");
var app = express();
var engines = require('consolidate');
var materias = require('./models/materias');

app.use('/css', express.static(__dirname + '/css'));
app.use('/fotos', express.static(__dirname + '/fotos'));
app.use(express.cookieParser());
app.use(express.session({'secret': "parrilla"}));
app.use(express.logger("dev"));

app.set('view engine', 'html');
app.engine('html', engines.handlebars)

app.listen(3000);