const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allUsers, infoUser } = require('../controllers');
const { UserInfo } = require('../db');

// | POST USUARIOS | //
router.post('', async (req, res) => {
  try {
    const { id, name, mail, username, avatar } = req.body;
    if (!name || !username || !mail) throw new Error('Missing params required');
    const user = await UserInfo.findOne({
      where: { id },
    });
    if (!user) {
      const newUser = await UserInfo.create({
        id,
        name,
        mail,
        username,
        avatar,
      });
      return res.json(newUser);
    }
    res.send('El usuario ya existe');
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || USUARIOS BASE DE DATOS NUESTRA || //
router.get('', async (req, res) => {
  try {
    const allUsers = await UserInfo.findAll();

    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || USUARIOS/:ID BASE DE DATOS NUESTRA || //
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await UserInfo.findByPk(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

// || PUT USUARIOS || //
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
