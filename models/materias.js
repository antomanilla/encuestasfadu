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
  /* Materias.getById recibe un idmateria y un callback, y llama al
  callback con un posible error y un objeto Materia correspondiente
  a la materia que lleva el id recibido. */
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
  /* Materias.getGroupedByNivel recibe un callback, y lo llama con
  un posible error y un array de arrays de objetos Materia x, donde x[i] es 
  una array de las materias del i+1-esimo nivel. */
  getGroupedByNivel: function(callback) {
    Materias.getAll(function(error, materias){
      if (error) return callback(error);
      var materiasniveladas = Materias.groupByNivel(materias);
      callback(undefined, materiasniveladas);
    });
  },
  /*Materias.groupByNivel recibe un array de objetos Materia y devuelve un 
  array de arrays de objetos Materia x, donde x[i] es un array de las materias 
  del i+1-esimo nivel .*/
  groupByNivel: function(materias) {
    var materiasniveladas = [[],[],[]];
    for(var i=0; i<materias.length; i++){
      materiasniveladas[materias[i].nivel-1].push(materias[i]);
    }
    return materiasniveladas;
  },
  /*Materias.getRegulares recibe un callback y lo llama con un posible error y
  un array de arrays de objetos Materia x, donde x[i] es un array de las materias 
  regulares del i+1-esimo nivel */
  getRegulares: function(callback) {
    db.all("select * from materias where regular = 1", function(error, rows) {
      if (error) return callback(error);
      var materias_regulares_niveladas = [];
      if (rows) {
        var materias = [];
        for(var i=0; i<rows.length; i++) {
          materias[i] = new Materia(rows[i].idmateria, 
                                    rows[i].nombre,
                                    rows[i].anual,
                                    rows[i].regular,
                                    rows[i].nivel);
        }
        materias_regulares_niveladas = Materias.groupByNivel(materias);
      }
      callback(undefined, materias_regulares_niveladas);
    });
  },
  /*Materias.getOptativas recibe un callback y lo llama con un posible error y
  un array de objetos Materia, siendo éstos materias optativas*/
  getOptativas: function(callback) {
    db.all("select * from materias where regular = 0", function(error, rows) {
      if (error) return callback(error);
      var materias_optativas = [];
      if (rows) {
        for(var i=0; i<rows.length; i++) {
          materias_optativas[i] = new Materia(rows[i].idmateria, 
                                    rows[i].nombre,
                                    rows[i].anual,
                                    rows[i].regular,
                                    rows[i].nivel);
        }
      }
      callback(undefined, materias_optativas);
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return Materias;
};