const router = require('express').Router()

const ActiveSession = require('../models/active_session')
const { tokenExtractor } = require('../util/middleware')


// log out
router.delete('/', tokenExtractor, async (req, res) => {
    const session = await ActiveSession.findOne({ where: { userId: req.decodedToken.id }})
    await session.destroy()
    res.status(204).end()
})

module.exports = router
