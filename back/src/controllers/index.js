require ('dotenv').config()
const axios = require('axios');
const router = require('../routes');



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

module.exports = {
    allProducts,
}