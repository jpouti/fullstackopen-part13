const router = require('express').Router()

const { User, Blog } = require('../models')

const { tokenExtractor, checkSession } = require('../util/middleware')

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: [
            {
                model: Blog,
                attributes: { exclude: ['userId']}
            }
        ],
    })
    res.json(users)
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

// Find user by params username
const userFinder = async (req, res, next) => {
    req.user = await User.findOne({ where: { username: req.params.username } })
    next()
}

// change a username
router.put('/:username', userFinder, tokenExtractor, checkSession, async (req, res) => {
    if (req.user) {
        req.user.username = req.body.username
        await req.user.save()
        res.json(req.user)
    } else {
        res.status(400).send({ error: 'User not found' })
    }
})

// return the user information by id
router.get('/:id', async (req, res) => {
    const where = {}
    if (req.query.read) {
        where.read = req.query.read
    }
    const user = await User.findByPk(req.params.id, {
        include: [{
            model: Blog,
            attributes: { exclude: ['userId'] },
            through: {
                attributes: ['id', 'read'],
                where
            },
        }],
    })
    if (user) {
        res.json({
            username: user.username,
            name: user.name,
            readings: user.blogs
        })
    } else {
        res.status(404).end()
    }
}) 

module.exports = router