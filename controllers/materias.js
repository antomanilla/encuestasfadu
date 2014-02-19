var Materias;

var materias = {
  showMateria: function (request, response) {
    Materias.getById(request.params.id, function(error, materia){
      if (error) return response.send(error.toString());
      var data = {
        nombre: materia.nombre
      }
      response.render("materia", data);
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db)
  return materias;
}

