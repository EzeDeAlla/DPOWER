const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allProducts } = require('../controllers');

                    // || /productos || //
router.get('', async(req, res) => {
    try{
    const products = await allProducts();
    res.status(200).send(products);
    } catch(error){
    res.status(400).send(error);
    }
})

                    // || /productos/id || //
router.get('/:id', async(req,res) => {
    const id = req.params.id;
    const products = await allProducts();
    if (id) {
        const filterId = await products.filter((e) => e.id == id);
        filterId.length
        ? res.status(200).send(filterId)
        : res.status(400).send('Id de producto no encontrada');
    }
} )



module.exports = router;