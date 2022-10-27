const { Router } = require('express');
const router = Router();
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

module.exports = router;
