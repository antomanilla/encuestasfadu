var db;

function Puntaje (idcriterio, nombrecriterio, valor) {
  this.idcriterio = idcriterio;
  this.nombrecriterio = nombrecriterio;
  this.valor = valor;
}

/* puntajes.getPuntajesByIdReview recibe un idreview y llama al callback
con un posible error y un array de objetos Puntaje (si los hay), siendo 
cada uno un puntaje de ese review */
var puntajes = {
  getPuntajesByIdReview: function (idreview, callback) {
    db.all("select puntajes.idcriterio, puntajes.valor, criterios.nombre " +
           "from puntajes, criterios " +
           "where puntajes.idreview = ? " +
                 "and puntajes.idcriterio = criterios.idcriterio", 
          [idreview], function(error, rows) {
      if (error) return callback (error);
      var finalpuntajes = [];
      for (var i=0; i<rows.length; i++){
        finalpuntajes[i] = new Puntaje (rows[i].idcriterio, rows[i].nombre, rows[i].valor);
      }
      callback(undefined, finalpuntajes);
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return { Puntajes: puntajes, Puntaje: Puntaje };
};
