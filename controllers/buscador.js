var Materias;

var buscador = {
  showResults: function (request, response) {
    if (!('buscador' in request.query)) return buscador.showForm(request, response);
    Materias.getByMatchingName(request.query.buscador, function(error, materias){
      if (error) return response.send(error.toString());
      var data = {
        materias: materias
      }
      response.render("searchresults", data);
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
  return buscador;
}

