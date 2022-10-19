const router = require('express').Router()

const { Blog } = require('../models')
const { sequelize } = require('../util/db')

// get statistic of each authors posts
router.get('/', async (req, res) => {
    const authors = await Blog.findAll({ 
        attributes: [
            ['author', 'author'],
            [sequelize.fn('COUNT', sequelize.col('id')), 'articles'],
            [sequelize.fn('SUM', sequelize.col('likes')), 'likes']
        ],
        group: ['author'],

    })
    res.json(authors)
})

module.exports = router


