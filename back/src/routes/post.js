const { Router } = require('express');
const router = Router();
const { UserInfo } = require('../db')



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