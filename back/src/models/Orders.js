const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('Order', {
    id: {  // Do not use in routes because it is automatically assigned when creating a new element
      type: DataTypes.INTEGER,
      allowNull: false,

      unique: true,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });
};
