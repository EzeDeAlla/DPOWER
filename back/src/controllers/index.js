require ('dotenv').config()
const axios = require('axios');
const router = require('../routes');
const { Product, Order } = require('../db');


const allProducts = async () => {
    const apiProducts = await axios.get(`https://fakestoreapi.com/products`);
    const allProductsMap = await apiProducts.data.map((e) => ({
        id: e.id,
        name: e.title,
        price: e.price,
        description: e.description,
        image: e.image,
        category: e.category,
    }))
    return allProductsMap;
}

 const dbData = async () => {
     try {
         const dbData = await Product.findAll({
            include: {
                model: Order,
                attributes: ['quantity'],
                through: {
                    attributes: [],
                },
            }
         });
         return dbData;
     } catch {
         return 'No created product founded'
     }
 }

 const todaInfo = async () => {
    const aInfo = await allProducts();
    const dbInfo = await dbData();
    const allInfo = aInfo.concat(dbInfo);
    return allInfo;
  };




const allUsers = async () => {
    const users = await axios.get('https://fakestoreapi.com/users');
    const usersMap = await users.data.map((e) => ({ 
        id: e.id, username: e.username, email: e.email, password: e.password,}))
    return usersMap;
}



module.exports = {
    allProducts,
    allUsers,
    dbData,
    todaInfo,
}