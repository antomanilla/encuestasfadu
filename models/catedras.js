var db;

function Catedra(idmateria, idcatedra, nombre, turno, promocionable, dia) {
  this.idmateria = idmateria;
  this.idcatedra = idcatedra;
  this.nombre = nombre;
  this.turno = turno;
  this.promocionable = promocionable;
  this.dia = dia;
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
  }
};

module.exports = function(db_) {
  db = db_;
  return Catedras;
};

