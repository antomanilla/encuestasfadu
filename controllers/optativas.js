var Materias;
var Catedras;

var optativas = {
 showOptativas: function(request, response) {
    Materias.getOptativas(function(error,optativas){
      if (error) throw error;
      else {
        Catedras.getByMateria(optativas.idmateria, function(error, catedras){
          var data = {
            optativa: optativas,
            idcatedra: catedras.idcatedra
          }
          response.render("optativas", data);
        });
      }
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  Catedras = require("../models/catedras")(db);
  return optativas;
}


