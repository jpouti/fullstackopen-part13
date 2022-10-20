const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

// adding a blog to users reading list
router.post('/', async (req, res) => {
    const { blogId, userId } = req.body
    const readingList = await ReadingList.create({ blogId, userId })
    res.json(readingList)
})

module.exports = router