function Review( idcatedra, idreview, comentario, puntajes, fecha) {
  this.idcatedra = idcatedra;
  this.idreview = idreview;
  this.comentario = comentario;
  this.puntajes = puntajes || [];
  this.fecha = fecha;
}


/* reviews.addReview recibe un objeto review, que tiene parametros idreview y fecha
  undefined, inserta el review en la db y llama al callback con el review ahora con 
  los datos completos*/

/* 
*/
var reviews = {
  addReview: function (review, callback) {
    db.run("insert into reviews (idcatedra, comentario) values (?,?)",
           [+review.idcatedra, review.comentario], function (error){
      if (error) return callback(error);
      var idreview = this.lastID;
      db.get("select idreview, fecha from reviews where idreview = ?",
             [idreview], function(error, row){
        if (error) return callback(error);
        var puntajes_ = []
        var semaphore = Object.keys(review.puntajes).length;
        var finish = function () {
          var finalreview = new Review(review.idcatedra,
                                       row.idreview,
                                       review.comentario,
                                       puntajes_,
                                       row.fecha);
          return callback(undefined, finalreview); 
        }
        if (!semaphore) return finish();
        for (var criterio in review.puntajes) {
          var valor = review.puntajes[criterio];
          var idcriterio = criterio.substring(1);
          Puntajes.getNombreByIdCriterio(idcriterio, (function (idcriterio_, valor_) {
            return function(error, nombrecriterio) {
              puntajes_.push(new Puntaje(idcriterio_, nombrecriterio, valor_));    
              db.run("insert into puntajes (idcriterio, idreview, valor) values (?,?,?)",
                     [+idcriterio_, +idreview, +valor_], function(error) {
                if (error) return callback (error);
                semaphore--;
                if (!semaphore) finish();
              });
            }
          })(idcriterio, valor));
        }     
      });
    });
  },

  /*reviews.getByIdCatedra recibe un idcatedra y un callback. llama al callback con un array
  de objetos del tipo Review , siendo estos los reviews pertenecientes a esa catedra */
  getByIdCatedra: function (idcatedra, callback) {
    db.all("select * from reviews where idcatedra = ?", [+idcatedra], function(error, rows){
      if (error) return callback (error);
      var allreviews = [];
      var semaphore = rows.length;
      if (!rows.length) return callback(undefined, allreviews);
      for (var i = 0; i<rows.length; i++){
        Puntajes.getPuntajesByIdReview(rows[i].idreview, function(i_) {
          return function (error, finalpuntajes){
            console.log("finalpuntajes vale", finalpuntajes);
            allreviews[i_] = new Review(rows[i_].idcatedra, 
                                     rows[i_].idreview,
                                     rows[i_].comentario,
                                     finalpuntajes,
                                     rows[i_].fecha);
            semaphore--;
            if (semaphore == 0){
              if (error) return callback (error);
              callback(undefined, allreviews);
            }
          }
        }(i));
      }
    });
  }
};

var db;
var Puntajes;
var Puntaje;
module.exports = function(db_) {
  db = db_;
  var puntajes = require('./puntajes')(db);
  Puntaje = puntajes.Puntaje;
  Puntajes = puntajes.Puntajes;

  return {
    Reviews : reviews,
    Review : Review
  };
};