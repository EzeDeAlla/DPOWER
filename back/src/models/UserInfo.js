const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    'UserInfo',
    {
      id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sport: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      age: {
        type: DataTypes.INTEGER,
      },
      nationality: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      powers: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      solicitud: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      validated: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
        // defaultValue: 'https://ibb.co/vxdbDGJ',
      },
    },
    {
      paranoid: true,
      deletedAt: 'destroyTime',
      timestamps: true,
    }
  );
};
