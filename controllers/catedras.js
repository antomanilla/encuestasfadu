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
            Reviews.getByIdCatedra(request.params.catedra, function(error, allreviews){
              var data = {
                nombre: catedra.nombre,
                materia: materia.nombre,
                dia: catedra.dia_nombre,
                turno: turno,
                promocionable: promocionable,
                idcatedra: catedra.idcatedra,
                idmateria: catedra.idmateria,
                comentarios: allreviews
              };
              response.render("catedra", data);  
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
                            undefined,
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
