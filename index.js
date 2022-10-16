require('dotenv').config()
const { Sequelize, Model, DataTypes } = require('sequelize')
const express = require('express');
const app = express()

app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

class Blog extends Model {}
Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'blog'
})

Blog.sync()

// get all the blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.findAll()
        res.json(blogs)        
    } catch (error) {
        console.error(error)
        return res.status(500)
    }
})

// post a new blog
app.post('/api/blogs', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch(error) {
        console.error(error)
        return res.status(400)
    }
})

// delete a blog post
app.delete('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id)
        await blog.destroy()
        res.sendStatus(204).end()
    } catch (error) {
        console.error(error)
        res.sendStatus(404)
    }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})