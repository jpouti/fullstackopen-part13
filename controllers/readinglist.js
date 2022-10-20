const router = require('express').Router()

const { Blog, User, ReadingList } = require('../models')

const { tokenExtractor } = require('../util/middleware')

// adding a blog to users reading list
router.post('/', async (req, res) => {
    const { blogId, userId } = req.body
    const readingList = await ReadingList.create({ blogId, userId })
    res.json(readingList)
})

// mark a blog as read
router.put('/:id', tokenExtractor, async (req, res) => {
    if (!req.body.read) {
        return res.status(400).send('Updated status missing')
    }
    const readinglist = await ReadingList.findByPk(req.params.id)
    console.log(readinglist.userId)
    if (req.decodedToken.id === readinglist.userId) {
        readinglist.read = req.body.read
        await readinglist.save()
        return res.json(readinglist)
    } else {
        res.status(401).send('unauthorized operation')
    }
})

module.exports = router