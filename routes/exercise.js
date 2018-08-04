const express = require('express');
const moment = require('moment');
const path = require('path');
const router = express.Router();
const User = require('../models/user');
const Exercise = require('../models/exercise');

router.post('/new-user', (req, res, next) => {
    const { username } = req.body;
    User.findOne({ username }).then(user => {
        if (user) throw new Error('username already taken');
        return User.create({ username })
    })
        .then(user => res.status(200).render(path.join(__dirname , '../views/info.pug'),{username: user.username,
            _id: user._id, newuser: true}))
        .catch(err => {
            console.log(err);
            res.status(500).render(path.join(__dirname , '../views/error1.pug'),{error1: true, message: err.message});
        })
})

router.post('/add', (req, res, next) => {
    let { userId, description, duration, date } = req.body;
    User.findOne({ _id: userId }).then(user => {
        if (!user) throw new Error('Unknown user with _id');
        date = date || Date.now();
        return Exercise.create({
            description, duration, date, userId
        })
            .then(ex => res.status(200).render(path.join(__dirname , '../views/info.pug'),{
                added: true,
                username: user.username,
                description, duration,
                _id: user._id,
                date: moment(ex.date).format('ddd MMMM DD YYYY')
            }))
    })
        .catch(err => {
            console.log(err);
            res.status(500).render(path.join(__dirname , '../views/error1.pug'),{error1: true, message: err.message});
        })
})

router.get('/log', (req, res, next) => {
    let { userId, from, to, limit } = req.query;
    from = moment(from, 'YYYY-MM-DD').isValid() ? moment(from, 'YYYY-MM-DD') : 0;
    to = moment(to, 'YYYY-MM-DD').isValid() ? moment(to, 'YYYY-MM-DD') : moment().add(1000000000000);
    User.findById(userId).then(user => {
        if (!user) throw new Error('Unknown user with _id');
        Exercise.find({ userId })
            .where('date').gte(from).lte(to)
            .limit(+limit).exec()
            .then(log => res.status(200).render(path.join(__dirname , '../views/info.pug'),{
                _id: userId,
                loguser: true,
                username: user.username,
                count: log.length,
                log: log.map((o,i) => ({
                    number: i + 1,
                    description: o.description,
                    duration: o.duration,
                    date: moment(o).format('ddd MMMM DD YYYY')
                }))
            }))
    })
        .catch(err => {
            console.log(err);
            res.status(500).render(path.join(__dirname , '../views/error1.pug'),{error1: true, message: err.message});
        })
})
console.log('loaded');
module.exports = router;