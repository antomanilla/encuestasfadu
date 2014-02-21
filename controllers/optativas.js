var Materias;

var optativas = {
 showOptativas: function(request, response) {
    Materias.getOptativas(function(error,optativas){
      if (error) throw error;
      else {
        var data = {
          optativa: optativas
        }
        response.render("optativas", data);
      }
    });
  }
};

var db;

module.exports = function(db_) {
  db = db_;
  Materias = require("../models/materias")(db);
  return optativas;
}


