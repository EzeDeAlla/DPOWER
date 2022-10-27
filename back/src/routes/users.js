const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allUsers, infoUser } = require('../controllers');
const { UserInfo } = require('../db');

router.post('', async (req, res) => {
  try {
    const {
      id,
      name,
      sport,
      age,
      nationality,
      description,
      post,
      username,
      mail,
      powers,
      validated,
    } = req.body;
    const user = await UserInfo.findOne({
      where: { mail },
    });
    if (id && name && sport && nationality && username && mail && powers && validated) {
      if (!user) {
        const newUser = await UserInfo.create({
          id,
          name,
          sport,
          age,
          nationality,
          description,
          post,
          username,
          mail,
          powers,
          validated,
        });
        res.json(newUser);
      } else {
        throw new Error('user already exists');
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || /usuarios api externa || //
// router.get('', async (req, res) => {
//   try {
//     let users = await infoUser();
//     res.status(200).send(users);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// || /usuarios base de datos nuestra || //
router.get('', async (req, res) => {
  try {
    const allUsers = await UserInfo.findAll();

    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const user = await UserInfo.findByPk(id);

  res.json(user);
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { powers } = req.query;

    const user = await UserInfo.findByPk(id);
    user.powers = powers;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
