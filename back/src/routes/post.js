const { Router } = require('express');
const router = Router();
const { Post, UserInfo, Comment, LikesForPost } = require('../db');
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

// para traer toda la tabla de union entre likes y post likeadoss
router.get('/likes', async (req, res) => {
  try {
    const allLikesForPost = await LikesForPost.findAll();
    res.json(allLikesForPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.get('/likes/:PostId', async (req, res) => {
  try {
    let { PostId } = req.params
    const allLikesForPost = await LikesForPost.findAll({where: {PostId: PostId}});
    res.json(allLikesForPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 // asdasdasdasasdasasdasasdasdsasdasdasdasvvvvv
// || POST/:ID || //
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  const post = await Post.findByPk(id);
  const idUser = post.UserInfoId;
  const postWithUser = await Post.findByPk(id, {
    include: [{
      model: Comment,
      attributes: ['content'],
      where: {
        PostId: id,
      },
    }, 

    {
      model: UserInfo,
      attributes: ['name', 'validated'],
      where: {
        id: idUser,
      },
    }, ],
  });
  res.json(postWithUser);
});
 // a
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
      throw new Error('the required data is empt');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/likes/:posteoId', async (req, res) => {
  try {
    let { posteoId } = req.params
    let { userId } = req.body
    const post = await Post.findByPk(posteoId)
    let usuario = await UserInfo.findByPk(userId)
    post.addUserInfo(usuario, { through: 'LikesForPost' })
    return res.json(post)
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
})

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
