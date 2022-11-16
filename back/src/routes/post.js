const { Router } = require('express');
const { default: Stripe } = require('stripe');
const router = Router();
const { Post, UserInfo, Comment, LikesForPost } = require('../db');
// const UserInfo = require('../models/UserInfo');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// || /POST || // pusheando lo mismo que yerson2
router.get('', async (req, res) => {
  try {
    const allPost = await Post.findAll();
    res.json(allPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// para traer toda la tabla de union entre likes y post likeados
router.get('/likes', async (req, res) => {
  try {
    const allLikesForPost = await LikesForPost.findAll();
    res.json(allLikesForPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// para traer todos los likes de un post y de un usuario
router.get('/likes/:postId/:userId', async (req, res) => {
  try {
    let { postId, userId } = req.params;
    if (postId && userId) {
      const allLikesForPost = await LikesForPost.findAll({
        where: {
          UserInfoId: userId,
          PostId: postId
        }
      }
      );
      res.json(allLikesForPost);
    } else {
      throw new Error('the info provided is not enough');
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// || POST/:ID || //
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByPk(id);
    const commentUser = await Comment.findAll({
      where: {
        PostId: id,
      }
    });
    if (post && commentUser.length) {
      const postWithUser = await Post.findByPk(id,
        {
          include:
          {
            model: Comment,
            where: {
              PostId: id,
            }
          }
          ,
        }
      );
      res.json(postWithUser);
    } else if (post) {
      const postWithUser = await Post.findByPk(id);
      res.json(postWithUser);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// a
// || POST /POST || //
router.post('', async (req, res) => {
  try {
    const { likes, powersGained, multimedia, description, UserInfoId } = req.body;
    if (multimedia && UserInfoId) {
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

router.post('/likes/:posteoId/:userId', async (req, res) => {
  try {
    let { posteoId, userId } = req.params // a ver si ahora si
    const post = await Post.findByPk(posteoId)
    const usuario = await UserInfo.findByPk(userId)
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

// RUTA DELETE

router.delete('/likes/:posteoId/:userId', async (req, res) => {
  try {
    let { posteoId, userId } = req.params
    if (posteoId && userId) {
      await LikesForPost.destroy({
        where: {
          UserInfoId: userId,
          PostId: posteoId
        }
      })
      res.json('Connection succesful');
    } else {
      throw new Error('the info provided is not enough');
    }
  }
  catch (error) {
    return res.status(500).json({ message: error.message })
  }
})
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

router.post('/pay', async (req, res) => {
  try {
    const { name, amount } = req.body;
    if (!name) return res.status(400).json({ message: 'Porfavor ingresa un nombre' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'USD',
      payment_method_types: ['card'],
      metadata: { name },
    });
    const clientSecret = paymentIntent.client_secret;
    res.json({ message: 'Pago iniciado', clientSecret });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error de servicio interno' });
  }
});

module.exports = router;
