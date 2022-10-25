const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,

      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    Comments: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.INTEGER,   // Here we put the author ID
      allowNull: false
    },
    postOwner: {
      type: DataTypes.INTEGER, // Here we put the ID of the post
      allowNull: false
    }
  });
};