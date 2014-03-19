var Materias;
var Catedras;

var materias = {
  showMateria: function (request, response) {
    Materias.getById(request.params.id, function(error, materia){
      if (error) return response.send(error.toString());
      Catedras.getByMateria(materia.idmateria, function(error, catedras){       
        if (error) throw error;
        var data = {
          nombre: materia.nombre,
          catedra: catedras,
          nivel: materia.nivel
        }
        response.render("materia", data);
      });    
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  Catedras = require("../models/catedras")(db);
  return materias;
}

