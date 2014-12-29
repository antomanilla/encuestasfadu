var Materias;
var Catedras;
var Reviews;

var buscador = {
  showResults: function (request, response) {
    if (!('buscador' in request.query)) return buscador.showForm(request, response);
    Materias.getByMatchingName(request.query.buscador, function(error, materias){
      if (error) return response.send(error.toString());
      Catedras.getByMatchingName(request.query.buscador, function(error, catedras){
        if (error) return response.send(error.toString());
        Reviews.getByMatchingText(request.query.buscador, function(error, reviews){
          if (error) return response.send(error.toString());
          var semaphore = reviews.length;
          var renderResults = function(){
            var data = {
              materias: materias,
              catedras: catedras,
              reviews: reviews
            }
            return response.render("searchresults",data);        
          }
          if (!semaphore) {
            renderResults();
          }
          for(var i=0; i<reviews.length; i++) {
            Catedras.getByIdCatedra(reviews[i].idcatedra, function(i_){
              return function(error,catedra){
                reviews[i_].idmateria = catedra.idmateria;
                semaphore--;
                if (semaphore==0) {
                  renderResults();
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

