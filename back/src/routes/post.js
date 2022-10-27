const { Router } = require('express');
const router = Router();
const { Post } = require('../db');

router.post('', async (req, res) => {
  try {
    const { likes, powersGained, multimedia, description } = req.body;
    if ((likes && powersGained, multimedia, description)) {
      const newPost = await Post.create({
        likes,
        powersGained,
        multimedia,
        description
      });
      res.json(newPost);
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
    await Post.destroy({
      where: {
        id,
      },
    });
    res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
