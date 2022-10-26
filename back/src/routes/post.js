const { Router } = require('express');
const router = Router();
const { Post } = require('../db');

router.post('', async (req, res) => {
  try {
    const { likes, powersGained, multimedia, description, id } = req.body;
    if ((likes && powersGained, multimedia, description, id)) {
      const newPost = Post.create({
        likes,
        powersGained,
        multimedia,
        description,
        id,
      });
      res.status(200).send(newPost);
    } else {
      throw new Error('the required data is empty');
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
