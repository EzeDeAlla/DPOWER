const { Router } = require('express');
const router = Router();
const { Comment, UserInfo, Post } = require('../db');

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const comment = await Comment.findByPk(id);
  const idUser = comment.UserInfoId;
  const commentWithUser = await Comment.findByPk(id, {
    include: {
      model: UserInfo,
      attributes: ['name'],
      where: {
        id: idUser,
      },
    },
  });
  res.json(commentWithUser);
});

// || POST /COMENTARIOS || //
router.post('', async (req, res) => {
  try {
    const { content, PostId, UserInfoId } = req.body;
    if (content) {
      const newComment = await Comment.create({
        content,
        PostId,
        UserInfoId,
      });
      res.json(newComment);
    } else {
      throw new Error('the required data is empty');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  // | AGREGAR RELACION USER | //
  // | AGREGAR RELACION CON EL POST | //
});

// || DELETE /COMENTARIOS || //
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
