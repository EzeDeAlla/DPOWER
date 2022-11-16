const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allUsers, infoUser } = require('../controllers');
const { UserInfo } = require('../db');
const nodemailer = require('nodemailer');

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
    res.json(user);
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

// RUTA POST PARA MAIL DE BIENVENIDA Y
router.post('/email/:mail', async (req, res) => {
  try {
    const { mail } = req.params;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: 'dpoweremail1@gmail.com', // generated ethereal user
        pass: 'jteohkxgbidkubwr', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let msg = {
      from: '"DPOWER team"', // sender address
      to: `${mail}`, // list of receivers
      subject: 'Welcome to the Team', // Subject line
      html: "<div style='text-align:left'><p>Thanks for joining!<br/><br/>You are officially part of the DPOWER community! We want you to have a great time supporting and following the greatest athletes of all!.</p></div>", // html body
    };

    transporter.sendMail(msg, (error, info) => {
      if (error) {
        res.status(500).send(error.message);
      } else {
        console.log('Email enviado');
        res.status(200).json('Email enviado correctamente a ' + mail);
      }
    });

    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account

    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } catch (error) {
    res.status(200).json({ message: error.message });
  }
});

// USUARIOS BASE DE DATOS NUESTRA //
router.get('', async (req, res) => {
  try {
    const allUsers = await UserInfo.findAll();
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || USUARIOS/:ID BASE DE DATOS NUESTRA || // as
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
    const { name, sport, age, nationality, description, avatar, validated, powers } = req.body;

    const user = await UserInfo.findByPk(id);
    user.name = name;
    user.sport = sport;
    user.age = age;
    user.nationality = nationality;
    user.description = description;
    user.avatar = avatar;
    user.validated = validated;
    user.powers = powers;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// PATCH USUARIOS
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const user = await UserInfo.findByPk(id);
    user.active = active;

    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

// delete usuarios
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const users = await UserInfo.findByPk(id);
    if (users !== null) {
      await UserInfo.destroy({
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

module.exports = router;
