var db;

function Cursada(idcatedra, idhorario, horario_nombre, dia, dia_nombre, idcuatrimestre, cuatrimestre) {
  this.idcatedra = idcatedra;
  this.idhorario = idhorario;
  this.horario_nombre = horario_nombre;
  this.dia = dia;
  this.dia_nombre = dia_nombre;
  this.idcuatrimestre = idcuatrimestre;
  this.cuatrimestre = cuatrimestre;
}

var Cursadas = {
  /* recibe una objeto Cursada y le agrega una propiedad dia_nombre que es 
  el nombre del dia de esta cursada. */    
  getByIdCatedra: function(idcatedra, callback) {
    var sql = "select " +
                  "cursadas.idcatedra, " +
                  "cursadas.idhorario, " +
                  "cursadas.idcuatrimestre, " +
                  "cursadas.dia, " +
                  "horarios.descripcion as horario_nombre, " +
                  "dias.nombre as dia_nombre, " +
                  "cuatrimestres.descripcion as cuatrimestre " +
            "from " +
                  "cursadas, " +
                  "horarios, " +
                  "dias, " +
                  "cuatrimestres " +
            "where " +
                  "cursadas.dia = dias.dia " +
                  "and cursadas.idcuatrimestre = cuatrimestres.idcuatrimestre " +
                  "and cursadas.idhorario = horarios.idhorario " +
                  "and cursadas.idcatedra = ? " +
            "order by cursadas.idhorario";
    console.log("Running query: ", sql, " with idcatedra = ", idcatedra);
    db.all(sql, [idcatedra], function(error, rows){
      if (error) return callback(error);
      var cursadas = [];
      for(var i=0; i<rows.length; i++) {
        cursadas[i] = new Cursada(rows[i].idcatedra,
                                  rows[i].idhorario,
                                  rows[i].horario_nombre,
                                  rows[i].dia,
                                  rows[i].dia_nombre,
                                  rows[i].idcuatrimestre,
                                  rows[i].cuatrimestre);    
      }
      callback(undefined, cursadas);
    });
  }
} 

module.exports = function(db_) {
  db = db_;
  return Cursadas;
};

