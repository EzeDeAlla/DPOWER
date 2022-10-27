const { Router } = require('express');
const router = Router();
const axios = require('axios');
const { allUsers } = require('../controllers');

                    // || /usuarios || //
router.get('', async (req, res) => {
    try{
    let users = await allUsers();
    res.status(200).send(users);
    } catch(error){
        res.status(400).send(error);
    }
})

                    // || /usuarios/id || //
router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const users = await allUsers();
    if (id) {
        const filterId = await users.filter((e) => e.id == id);
        filterId.length
        ? res.status(200).send(filterId)
        : res.status(400).send('Id del usuario no encontrada');
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { powers } = req.query;

        let user = await UserInfo.update(
            {
                powers: powers,
            },
            {
                where: {
                    id: id
                },
            }
        );
        res.send(user)
    }
    catch {
        return null
    }
})


module.exports = router;