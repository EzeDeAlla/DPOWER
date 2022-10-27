const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allProducts, dbData, todaInfo } = require('../controllers');
const { Product } = require('../db')


                    // || /productos || //
router.get('', async(req, res) => {
    try{
    const products = await todaInfo();
    res.status(200).send(products);
    } catch(error){
    res.status(400).send(error);
    }
})

                    // || /productos/id || //
router.get('/:id', async(req,res) => {
    const id = req.params.id;
    const products = await todaInfo();
    if (id) {
        const filterId = await products.filter((e) => e.id == id);
        filterId.length
        ? res.status(200).send(filterId)
        : res.status(400).send('Id dProductse producto no encontrada');
    }
} )


        router.put('/:id', async (req, res) => {
            try {
                const { id } = req.params;
                const { name, stock, category, price } = req.body;
console.log(name);
console.log(id);
                await Product.update(
                    console.log(name, id),
                { name: name, price: price, stock: stock, category: category},
                {
                    where: {
                        id: id,
                    },
                 }
                );
                res.status(200).send('Put Hecho en products')
            }
            catch (error){
                console.log(error)
                res.status(404).send('no funciona mi pana')
            }
        })



module.exports = router;