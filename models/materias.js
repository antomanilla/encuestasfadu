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
                                    rows[i].regular,
                                    rows[i].nivel);
        }
        callback(undefined, materias);
      }
    });
  },
    getById: function(idmateria, callback) {
    db.get("select * from materias where idmateria = ?",[idmateria], 
           function(error, row){
      if (error) return callback(error);
      if (row) {
        var materia = new Materia(row.idmateria, 
                                    row.nombre,
                                    row.anual,
                                    row.regular,
                                    row.nivel);
        callback(undefined, materia)
      } else {
        callback("No existe tal materia", undefined);
      }
    });
  
  },
  getGroupedByNivel: function(callback) {
    Materias.getAll(function(error, materias){
      if (error) callback(error);
      else {
        var materiasniveladas = [[],[],[]];
        for(var i=0; i<materias.length; i++){
          materiasniveladas[materias[i].nivel-1].push(materias[i]);
        }
      }
      callback(undefined, materiasniveladas);
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return Materias;
};