const jwt = require('jsonwebtoken')
const ActiveSession = require('../models/active_session')
const User = require('../models/user')
const { SECRET } = require('../util/config')

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if(error.name === 'SequelizeValidationError') {
        return res.status(400).json({ error: error.message })
    } else if(error.name === 'TypeError') {
        return res.status(400).send({ error: error.message })
    } else if(error.name === 'SyntaxError') {
        return res.status(400).send({ error: error.message })
    }
    next(error)
}

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

// check if session is valid
const checkSession = async (req, res, next) => {
    const session = await ActiveSession.findOne({
        where: {
            userId: req.decodedToken.id
        }
    })
    if (session) {
        const user = await User.findByPk(session.userId)
        // handle disabled user
        if (user.disabled) {
            await session.destroy()
            return res.status(401).json({ error: 'User has been disabled'})
        }
        // handle expired session
        if (session.expire < Date.now()) {
            await session.destroy()
            return res.status(401).json({ error: 'Session has expired'})
        }
    } else {
        return res.status(400).json({ error: 'No active sessions, please try to log in again'})
    }
    next()
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    checkSession
}