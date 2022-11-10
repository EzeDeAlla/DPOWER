const { Router } = require('express');
const router = Router();
const { Post, UserInfo, Comment } = require('../db');
// const UserInfo = require('../models/UserInfo');

// || /POST || //
router.get('', async (req, res) => {
  try {
    const allPost = await Post.findAll();
    res.json(allPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 // asdasdasdasasdas
// || POST/:ID || //
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const post = await Post.findByPk(id);
  const idUser = post.UserInfoId;
  const idComment = 1;
  const postWithUser = await Post.findByPk(id, {
    include: {
      model: UserInfo,
      attributes: ['name', 'id', 'validated'],
      where: {
        id: idUser,
      },
    },
  //   include: [{
  //     model: Comment,
  //     where: { id: idComment }
  // }, {
  //     model: UserInfo,
  //     attributes: ['name', 'id', 'validated'],
  //     where: { id: idUser }
  // }],
    // include: {
    //   model: Comment,
    //   attributes: ['content'],
    //   where: {
    //     id: idComment,
    //   },
    // },
  });
  res.json(postWithUser);
});

// || POST /POST || //
router.post('', async (req, res) => {
  try {
    const { likes, powersGained, multimedia, description, UserInfoId } = req.body;
    if ( multimedia && UserInfoId) {
      const newPost = await Post.create({
        likes,
        powersGained,
        multimedia,
        description,
        UserInfoId,
      });
      res.json(newPost);
    } else {
      throw new Error('the required data is empty');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || DELETE /POST || //
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    if (post !== null) {
      await Post.destroy({
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

// || PUT /POST || //
// || MODIFICA TODO EL POST O SOLO ALGO PERO HAY QUE PONER TODO || //
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { likes, multimedia, description, powersGained } = req.body;
//     const postUpdate = await Post.findByPk(id);
//     postUpdate.likes = likes;
//     postUpdate.multimedia = multimedia;
//     postUpdate.description = description;
//     postUpdate.powersGained = powersGained;

//     await postUpdate.save();

//     res.json(postUpdate);
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// });

// || MOFICIA SOLO LOS LIKES Y LOS POWERS || //
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { likes, powersGained } = req.body;
    const postUpdate = await Post.findByPk(id);
    postUpdate.likes = likes;
    postUpdate.powersGained = powersGained;

    await postUpdate.save();

    res.json(postUpdate);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
