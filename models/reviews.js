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
var reviews = {
  addReview: function (review, callback) {
    db.run("insert into reviews (idcatedra, comentario) values (?,?)",
           [review.idcatedra, review.comentario], function (error){
      db.get("select idreview, fecha from reviews where idreview = ?",
             [this.lastID], function(error, row){
        if (error) return callback (error);
        var finalreview = new Review(review.idcatedra,
                                     row.idreview,
                                     review.comentario,
                                     review.puntajes,
                                     row.fecha);
        callback(undefined, finalreview);
      });
    });
  },
  /*reviews.getByIdCatedra recibe un idcatedra y un callback. llama al callback con un array
  de objetos del tipo Review , siendo estos los reviews pertenecientes a esa catedra */
  getByIdCatedra: function (idcatedra, callback) {
    db.all("select * from reviews where idcatedra = ?", [idcatedra], function(error, rows){
      if (error) return callback (error);
      var allreviews = [];
      for (var i = 0; i<rows.length; i++){
      allreviews[i] = new Review(rows[i].idcatedra, 
                                 rows[i].idreview,
                                 rows[i].comentario,
                                 [],
                                 rows[i].fecha);
      }
      callback(undefined, allreviews);
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  return {
    Reviews : reviews,
    Review : Review
  };
}