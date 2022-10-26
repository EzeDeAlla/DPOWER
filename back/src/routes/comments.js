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
      res.status(200).send(newComment);
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
