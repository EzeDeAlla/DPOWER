const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allProducts, dbData, todaInfo } = require('../controllers');
const { Product } = require('../db');

// const dataBaseTesting = [

//   (item1 = {
//     name: 'nombrePrueba1',
//     category: 'categoriaPrueba1',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
//   (item2 = {
//     name: 'nombrePrueba2',
//     category: 'categoriaPrueba2',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
//   (item3 = {
//     name: 'nombrePrueba3',
//     category: 'categoriaPrueba3',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
//   (item4 = {
//     name: 'nombrePrueba4',
//     category: 'categoriaPrueba4',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
//   (item5 = {
//     name: 'nombrePrueba5',
//     category: 'categoriaPrueba5',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
//   (item6 = {
//     name: 'nombrePrueba6',
//     category: 'categoriaPrueba6',
//     price: 1,
//     stock: 1,
//     published: 1,
//   }),
// ];

// dataBaseTesting.map(
//   async (el) =>
//     await Product.create({
//       name: el.name,
//       category: el.category,
//       price: el.price,
//       stock: el.stock,
//       published: el.published,
//     })
// );
// const mostrar = async () => {
//   console.log(await Product.findAll());
// };
// mostrar();
// || /productos || //
router.get('', async (req, res) => {
  try {
    const products = await todaInfo();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

// || /productos/id || //
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const products = await todaInfo();
  if (id) {
    const filterId = await products.filter((e) => e.id == id);
    filterId.length
      ? res.status(200).send(filterId)
      : res.status(400).send('Id de producto no encontrada');
  }
});

router.post('', async (req, res) => {
  try {
    const { id, name, category, price, stock, published } = req.body;

    if (id && name && category && price && stock && published) {
      const newProduct = await Product.create({
        id,
        name,
        category,
        price,
        stock,
        published,
      });

      res.json(newProduct);
    } else {
      throw new Error('the required data is empty');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Product.destroy({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, stock, category, price } = req.body;

    const product = await Product.findByPk(id);
    product.name = name;
    product.stock = stock;
    product.category = category;
    product.price = price;

    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
