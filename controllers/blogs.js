const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const { Op } = require('sequelize')

// get all the blogs
router.get('/', async (req, res) => {

    // get blogs with search parameter set, based on likes descending order
    if (req.query.search) {
        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            },
            where: {
                [Op.or]: [
                    {
                        title: {
                            [Op.substring]: req.query.search
                        }
                    },
                    {
                        author: {
                            [Op.substring]: req.query.search
                        }
                    }
                ]
            },
            order: [
                ['likes', 'DESC']
            ]

        })
        res.json(blogs)
    } else { // get all blogs based on likes descending order
        const blogs = await Blog.findAll({
            attributes: { exclude: ['userId'] },
            include: {
                model: User,
                attributes: ['name']
            },
            order: [ 
                ['likes', 'DESC']
            ]
        })
        res.json(blogs)   
    }
     
})

// decode token
const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch {
            return res.status(401).json({ error: 'invalid token' })
        }
    } else {
        return res.status(401).json({ error: 'missing token' })
    }
    next()
}

// post a new blog
router.post('/', tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId: user.id })
    res.json(blog)
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

// delete a blog post
router.delete('/:id', blogFinder, tokenExtractor, async (req, res) => {
    const user = await User.findByPk(req.decodedToken.id)
    if (req.blog && req.blog.userId === user.id) {
        await req.blog.destroy()
        res.status(204).end()
    } else {
        res.status(400).send({ error: 'not authorized to delete this blog'})
    }
})

// modify the blog post likes
router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(400).send({ error: 'blog not found'})
    }

})

module.exports = router