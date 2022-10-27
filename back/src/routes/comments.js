const { Router } = require('express');
const router = Router();
const { Comment } = require('../db');

router.post('', async (req, res) => {
  try {
    const { id, content } = req.body;
    if (id && content) {
      const newComment = await Comment.create({
        id,
        content,
      });
      res.json(newComment);
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
    const comment = await Comment.findByPk(id);
    if (comment !== null) {
      await Comment.destroy({
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
