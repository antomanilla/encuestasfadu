var Materias;
var Catedras;

var catedras = {
  showCatedra: function (request, response) {
    Catedras.getByIdCatedra(request.params.catedra, function(error,catedra) {
      if (error) {
        response.send("Hubo un error :", error);
      } else if (catedra.idmateria) {
        Materias.getById(catedra.idmateria, function(error, materia){
          if (error) {
           response.send("Hubo un error :", error);
          }
          Catedras.addDia_nombre(catedra, function(){
            var turno;
            var promocionable;
            if (catedra.turno == 1) {
              turno = "8:30 a 12:30";
            } else if (catedra.turno ==2) {
              turno = "14:00 a 18:00";
            } else {
              turno = "19:00 a 23:00";
            }
            if (catedra.promocionable == 1) {
              promocionable = "Esta materia es promocionable.";
            } else {
              promocionable = "Esta materia tiene final obligatorio.";
            }

            var data = {
              nombre: catedra.nombre,
              materia: materia.nombre,
              dia: catedra.dia_nombre,
              turno: turno,
              promocionable: promocionable
            }  
            response.render("catedra", data);  
          });
        });
      } else {
        response.send("No existe esta catedra");
      }
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  Catedras = require("../models/catedras")(db);
  return catedras;
}
