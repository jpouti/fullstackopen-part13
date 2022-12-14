const express = require('express');
require('express-async-errors')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/authors')
const logoutRouter = require('./controllers/logout')
const readingListRouter = require('./controllers/readinglist')
const middleware = require('./util/middleware')

app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readingListRouter)
app.use('/api/logout', logoutRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()