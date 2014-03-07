var Materias;
var Catedras;
var Review;
var Reviews;

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
            var turno = Catedras.translateTurno(catedra.turno);
            Catedras.addPromedioGeneral(catedra, function(error){
              if (error) {
                response.send("Hubo un error :", error);
              }
              Reviews.getByIdCatedra(request.params.catedra, function(error, allreviews){
                var data = {
                  nombre: catedra.nombre,
                  materia: materia.nombre,
                  dia: catedra.dia_nombre,
                  turno: turno,
                  promocionable: catedra.promocionable,
                  idcatedra: catedra.idcatedra,
                  idmateria: catedra.idmateria,
                  comentarios: allreviews,
                  promediogeneral: catedra.promediogeneral
                };
              response.render("catedra", data);  
              });
            });            
          });
        });
      } else {
        response.send("No existe esta catedra");
      }
    });
  },
  //catedras.uploadReview toma lo que esta en el input del comentario
  //luego crea un objeto Review y llamar a review.addReview 
  uploadReview: function (request, response) {
    var review = new Review (request.body.idcatedra,
                            undefined,
                            request.body.comentario,
                            request.body.puntajes,
                            undefined);
    Reviews.addReview (review, function (error, finalreview) {
      catedras.showCatedra(request, response);
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  Catedras = require("../models/catedras")(db);
  var reviews = require("../models/reviews")(db);
  Reviews = reviews.Reviews;
  Review = reviews.Review;
  return catedras;
}
