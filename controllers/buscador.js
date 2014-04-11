var Materias;
var Catedras;
var Reviews;

var buscador = {
  showResults: function (request, response) {
    if (!('buscador' in request.query)) return buscador.showForm(request, response);
    Materias.getByMatchingName(request.query.buscador, function(error, materias){
      if (error) return response.send(error.toString());
      Catedras.getByMatchingName(request.query.buscador, function(error, catedras){
        Reviews.getByMatchingText(request.query.buscador, function(error, reviews){
          var semaphore = reviews.length;
          for(var i=0; i<reviews.length; i++) {
            Catedras.getByIdCatedra(reviews[i].idcatedra, function(i_){
              return function(error,catedra){
                reviews[i_].idmateria = catedra.idmateria;
                semaphore--;
                if (semaphore==0) {
                  var data = {
                    materias: materias,
                    catedras: catedras,
                    reviews: reviews
                  }
                  response.render("searchresults", data);
                }   
              }
            }(i));
          }
        });
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
  Reviews = require("../models/reviews")(db).Reviews;
  return buscador;
}

