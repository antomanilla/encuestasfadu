var Materias;
var Catedras;

var buscador = {
  showResults: function (request, response) {
    if (!('buscador' in request.query)) return buscador.showForm(request, response);
    Materias.getByMatchingName(request.query.buscador, function(error, materias){
      if (error) return response.send(error.toString());
      Catedras.getByMatchingName(request.query.buscador, function(error, catedras){
        console.log("catedras vale", catedras);
        var data = {
          materias: materias,
          catedras: catedras
        }
        response.render("searchresults", data);
      });
    });
  },
  showForm: function (request, response) {
    response.render("buscador");
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  Catedras = require("../models/catedras")(db);
  return buscador;
}

