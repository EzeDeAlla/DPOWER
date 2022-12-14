require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');
// const { DB_USER, gitDB_PASSWORD, DB_HOST } = process.env;

const { PGHOST, PGUSER, PGPASSWORD, PGPORT } = process.env;

const sequelize = new Sequelize(`postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/railway`, {
  logging: false, // set to console.log to see the raw SQL queries
  native: false, // lets Sequelize know we can use pg-native for ~30% more speed
  port: PGPORT,
});

// const sequelize = new Sequelize(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/depawer`, {
//   logging: false, // set to console.log to see the raw SQL queries
//   native: false, // lets Sequelize know we can use pg-native for ~30% more speed
// });
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
  .filter((file) => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Comment, Order, Post, Product, UserInfo, User } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

// UserInfo.belongsToMany(UserInfo, {
//   through: 'subUserInfo',
//   foreignKey: 'FollowedId',
//   otherKey: 'FollowerId',
//   as: 'subUserInfor',
// });
// relacion muchos a muchos para los usuarios poder seguir a otros usuarios
UserInfo.belongsToMany(UserInfo, {
  as: 'follower',
  foreignKey: 'userToFollowId',
  through: 'UserInfoFavorites',
});
UserInfo.belongsToMany(UserInfo, {
  as: 'userToFollow',
  foreignKey: 'followerId',
  through: 'UserInfoFavorites',
});

// relacion muchos a muchos para los post y usuarios (controlar los likes)
UserInfo.belongsToMany(Post, { through: 'LikesForPost' });
Post.belongsToMany(UserInfo, { through: 'LikesForPost' });

// UserInfo.belongsToMany(Post, {
//   as: 'viewer',
//   foreignKey: 'postToLikeId',
//   through: 'LikesForPost',
// });
// Post.belongsToMany(UserInfo, {
//   as: 'postToLike',
//   foreignKey: 'viewerId',
//   through: 'LikesForPost',
// });

User.belongsTo(UserInfo);
Post.belongsTo(UserInfo);
Post.hasMany(Comment);
Comment.belongsTo(Post);
Comment.belongsTo(UserInfo);
Order.belongsTo(UserInfo);
Order.belongsToMany(Product, { through: 'OrderProduct' });
Product.belongsToMany(Order, { through: 'OrderProduct' });
Product.belongsTo(UserInfo);

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
