const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')
const ActiveSession = require('../models/active_session')

// user logging in
router.post('/', async (req, res) => {
    const body = req.body

    const user = await User.findOne({
        where: {
            username: body.username
        }
    })

    if (user.disabled === true) {
        return res.status(401).json({
            error: 'User has been disabled, please contact admin for further details'
        })
    }

    // for this practice application password is hardcoded same for all users 
    const passwordCorrect = body.password === 'secret'

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)

    // create new active session when user logs in
    const session = await ActiveSession.create({
        userId: user.id
    })

    res.status(200).send({
        token,
        username: user.username,
        name: user.name,
        expire: session.expire
    })
})

module.exports = router