const router = require('express').Router()

const { response } = require('express')
const { Blog } = require('../models')

// get all the blogs
router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)        
})

// post a new blog
router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    res.json(blog)
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

// delete a blog post
router.delete('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
        await req.blog.destroy()
        res.status(204).end()
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