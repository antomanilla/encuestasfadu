var Materias;

var main = {
  showMateriasRegulares: function(request, response) {
    Materias.getGroupedByNivel(function(error,materias){
      if (error) throw error;
      else {
        var data = {
          nivel: materias
        }
        response.render("main", data);
      }
    });
  }
};

var db;

module.exports = function(db_){
  db = (db_);
  Materias = require("../models/materias")(db);
  return main;
}