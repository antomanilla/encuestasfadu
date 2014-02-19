var db;

function Materia(idmateria, nombre, anual, regular, nivel) {
  this.idmateria = idmateria;
  this.nombre = nombre;
  this.anual = anual;
  this.regular = regular;
  this.nivel = nivel;
}

var Materias = {
  /* Materias.getAll recibe un callback, y lo llama pasandole
  un posible error, y un array de objetos Materia, siendo cada
  objeto una materia de la base de datos. */
  getAll: function(callback) {
    db.all("select * from materias", function(error, rows) {
      if (error) callback(error);
      else {
        var materias = [];
        for(var i=0; i<rows.length; i++) {
          materias[i] = new Materia(rows[i].idmateria, 
                                    rows[i].nombre,
                                    rows[i].anual,
                                    rows[i].regular
                                    rows[i].nivel);
        }
        callback(undefined, materias);
      }
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return Materias;
};