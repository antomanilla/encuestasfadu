var db;

function Catedra(idmateria, idcatedra, nombre, turno, promocionable, dia, promediogeneral) {
  this.idmateria = idmateria;
  this.idcatedra = idcatedra;
  this.nombre = nombre;
  this.turno = turno;
  this.promocionable = promocionable == 1;
  this.dia = dia;
  this.promediogeneral = promediogeneral;
}

var Catedras = {
  /* Catedras.getByMateria recibe un idmateria y un callback y llama al 
  callback con un array de objetos del tipo catedra, con las catedras que
  existen para esa materia*/
  getByMateria: function(idmateria, callback) {
    db.all("select * from catedras where idmateria = ?",
           [idmateria], 
           function(error, rows) {
      if (error) callback(error);
      else {
        var catedras = [];
        for(var i=0; i<rows.length; i++) {
          catedras[i] = new Catedra(rows[i].idmateria, 
                                    rows[i].idcatedra,
                                    rows[i].nombre,
                                    rows[i].turno,
                                    rows[i].promocionable,
                                    rows[i].dia);
        }
        callback(undefined, catedras);
      }
    });
  },
  
  /* recibe una objeto Catedra y le agrega una propiedad dia_nombre que es 
  el nombre del dia de esta cátedra.  */   
  
  addDia_nombre: function(catedra, callback) {
    db.get("select nombre from dias where dia = ?", [catedra.dia], function(error, row){
      if (error) return callback(error);
      if (row) {
        catedra.dia_nombre = row.nombre;    
      } 
      callback();
    });
  },
  
  /*recibe un array de catedras y un callback y agrega la propiedad dia_nombre a cada Catedra.
  Al terminar llama al callback */
  addDia_nombreMultiple: function(catedras, callback) {
    var semaphore = catedras.length;
    var posible_error;
    for (var i = 0; i<catedras.length; i++) {
      addDia_nombre(catedras[i], (function(_i) {
        return function(error){
          if (error) posible_error = error;
          semaphore--;
          if(semaphore==0) {
            callback(posible_error);
          }
        }
      })(i));
    }
  },
  /*recibe el id de una catedra y un callback. llama al callback con un objeto
  de tipo Catedra, correspondiente a la catedra con ese id*/
  getByIdCatedra: function(idcatedra, callback) {
    db.get("select * from catedras where idcatedra = ?", [idcatedra], function(error, row){
      if (error) return callback(error);
      var catedra = {}
      if (row) {
        catedra = new Catedra(row.idmateria, 
                              row.idcatedra,
                              row.nombre,
                              row.turno,
                              row.promocionable,
                              row.dia);
      }
      callback(undefined, catedra);
    });
  },
  translateTurno: function (turno) {   
    if (turno == 1) {
      return "8:30 a 12:30";
    } else if (turno ==2) {
      return "14:00 a 18:00";
    } else {
      return "19:00 a 23:00";
    }
  },
  addPromedioGeneral: function(catedra,callback){
    var str = "select avg(puntajes.valor) from puntajes, reviews " + 
           "where puntajes.idreview=reviews.idreview " +
           "and reviews.idcatedra=? and puntajes.idcriterio=2";
    db.get(str,[+catedra.idcatedra], 
           function(error,row) {
      if (error) return callback(error);
      if (row) {
        console.log("row de promedio general vale ",row["avg(puntajes.valor)"]);
        catedra.promediogeneral = row["avg(puntajes.valor)"].toFixed(2);;    
      } 
      callback();
    });   
  }
};

module.exports = function(db_) {
  db = db_;
  return Catedras;
};

