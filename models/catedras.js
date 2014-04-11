var db;

function Catedra(idmateria, idcatedra, nombre, promocionable, promediogeneral) {
  this.idmateria = idmateria;
  this.idcatedra = idcatedra;
  this.nombre = nombre;
  this.promocionable = promocionable == 1;
  this.promediogeneral = promediogeneral;
  this.cursadas  = [];
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
                                    rows[i].promocionable);
        }
        callback(undefined, catedras);
      }
    });
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
                              row.promocionable);
      }
      callback(undefined, catedra);
    });
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
        var num = row["avg(puntajes.valor)"];    
        catedra.promediogeneral = Math.round(num * 100) / 100;
      } 
      callback();
    });   
  },
  getByMatchingName: function(name, callback) {
    name = name.replace('á', 'a');
    name = name.replace('é', 'e');
    name = name.replace('í', 'i');
    name = name.replace('ó', 'o');
    name = name.replace('ú', 'u');
    db.all("select * from catedras where replace(replace(replace(replace(replace(nombre, 'á', 'a'), 'é','e'), 'í','i'), 'ó','o'),'ú','u') like ?", ["%"+name+"%"], function(error, rows) {
      if (error) return callback(error);
      var catedras = [];
      for(var i=0; i<rows.length; i++) {
        catedras[i] = new Catedra(rows[i].idmateria, 
                                  rows[i].idcatedra,
                                  rows[i].nombre,
                                  rows[i].promocionable);
      }
      callback(undefined, catedras);
    });
  }
};

module.exports = function(db_) {
  db = db_;
  return Catedras;
};

