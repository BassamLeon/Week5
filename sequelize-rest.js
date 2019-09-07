const express = require('express')
const Sequelize = require('sequelize');
const port = 4000
const app = express()
const sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres');

const Movie = sequelize.define('movie',{
    title: Sequelize.TEXT,
    yearOfRelease: Sequelize.INTEGER,
    synopsis: Sequelize.TEXT
});

sequelize.sync() 
    .then(() => Movie.truncate()) 
    .then(() => Promise.all([ 
        Movie.create({ title: 'Troy', yearOfRelease: 2004 , synopsis: 'Based on Homers lliad' }),
        Movie.create({ title: 'Zoro', yearOfRelease: 1998 , synopsis: 'After being imprisoned for 20 years,' }),
        Movie.create({ title: 'The Avengers', yearOfRelease: 2012 , synopsis: 'gains access to the unlimited power of the energy cube called the Tesseract' })
    ]))

    app.post('/movie', (req, res, next) => {
        Movie.create(req.body)
            .then(movie => res.json(movie))
            .catch(next)
    })

    app.get('/movie', (req, res, next) => {
        const limit = req.query.limit || 2
        const offset = req.query.offset || 0
      
        Promise.all([
        Movie.count(),
        Movie.findAll({ limit, offset })
        ])
          .then(([total, movies]) => {
            res.send({
              movies, total
            })
          })
          .catch(error => next(error))
      })

    app.get('/movie/:Id', (req, res, next) => {
        Movie.findOne({
            where: {
                id: req.params.Id,
            }
        })
            .then(movie => {
                if (movie) {
                    return res.json(movie)
                }
                return res.status(404).end()
            })
            .catch(next)
    })
          
    app.put(
        '/movie/:id',
        (req, res, next) => 
        Movie
          .findByPk(req.params.id)
          .then(movie => movie.update(req.body))
          .then(movie => res.send(movie))
          .catch(next)
      )
    app.delete('/movie/:id',(req, res, next) => 
        Movie
          .destroy({ where: { id: req.params.id }})
          .then(number => res.send({ number }))
          .catch(next)
      )
    app.listen(port, () => console.log("listening on port " + port))
    
