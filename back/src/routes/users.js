const { Router } = require('express');
const router = Router();
const { User } = require('../db');

router.post('', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({
      where: { email },
    });
    if (name && email && password) {
      if (!user) {
        const newUser = await User.create({
          name,
          email,
          password,
        });
        res.status(200).send(newUser);
      } else {
        throw new Error('user already exists');
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
