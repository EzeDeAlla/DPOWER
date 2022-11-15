const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { todaInfo } = require('../controllers');
const { Product } = require('../db');
const stripe = require('stripe')('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', {apiVersion:"2022-08-01" });
//const stripe = require('stripe')('pk_test_51M4E9pEh4Kq9bXBevoiyg0Hj62Wpftk46CMLdh3EeXKrzuTRcQ183sVmxQqdCYFiiwih6ncz6hxFluRgC8jOQacj00rV3b75qe', {apiVersion:"2022-08-01" });

// || /PRODUCTOS || //
router.get('', async (req, res) => {
  try {
    const products = await todaInfo();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

// || /PRODUCTOS/:ID || //
router.get('/:id', async (req, res) => {
  try{
  const id = req.params.id;
  const products = await todaInfo();
  if (id) {
    const filterId = await products.filter((e) => e.id == id);
    filterId.length
      ? res.status(200).send(filterId)
      : res.status(400).send('Id de producto no encontrada');
  }
    } catch(error){
      res.status(500).send(error); 
  }
});

// || POST /PRODUCTOS || //
router.post('', async (req, res) => {
  try {
    const { name, category, price, stock, published, image, description } = req.body;

    if (name && category && price && stock && published && description) {
      const newProduct = await Product.create({
        name,
        category,
        price,
        stock,
        published,
        image,
        description,
      });

      res.json(newProduct);
    } else {
      throw new Error('the required data is empty');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || DELETE /PRODUCTOS || //
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (product !== null) {
      await Product.destroy({
        where: {
          id,
        },
      });
      res.sendStatus(204);
    } else {
      throw new Error('the id does not exist');
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// || PUT /PRODUCTOS || //
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, category, price, image } = req.body;

    const product = await Product.findByPk(id);
    product.name = name;
    product.stock = stock;
    product.category = category;
    product.price = price;
    product.image = image;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});



router.post('/pay', async (req, res) => {
  try {
    const customer = await stripe.customers.create();
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2022-08-01' }
    );
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: 'usd',
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      //publishableKey: 'pk_live_51M4E9pEh4Kq9bXBe3cJWSiz7dGFC9QTIO45dcNT3cuaRNuo66mMChGfSsOQCtXH8TxDLrvvg6JYcP7Rjl1MUYXGf005YbszUUl'
      publishableKey: 'pk_test_51M4E9pEh4Kq9bXBevoiyg0Hj62Wpftk46CMLdh3EeXKrzuTRcQ183sVmxQqdCYFiiwih6ncz6hxFluRgC8jOQacj00rV3b75qe'
    });
//
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});

module.exports = router;
