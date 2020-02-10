const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(cors())
app.use(express.static('build'))
app.use(express.json())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

morgan.token('person', function getPerson (req) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status - :response-time ms - :person'))

// let persons = [
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": 1
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523",
//       "id": 2
//     },
//     {
//       "name": "Dan Abramov",
//       "number": "12-43-234345",
//       "id": 3
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122",
//       "id": 4
//     }
//   ]

  
  app.get('/api/persons', (req, res) => {
    console.log('fluffy couscous')
    Person.find({}).then(persons => {
      res.json(persons.map(person => person.toJSON()))
    })
  })

  app.get('/info', (req, res) => {
      console.log('sushi time!')
      Person.countDocuments().then(count => {res.send(`<p>Phonebook has info of ${count} people</p>
      <p>${new Date()}</p>`)})
      
  })

  app.get('/api/persons/:id', (req, res, next) => {
      Person.findById(req.params.id)
        .then(person => {
          if(person) {
            res.json(person.toJSON())
          } else {
            res.status(404).end()
          }
      })
      .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (req, res, next) => {
      Person.findByIdAndRemove(req.params.id)
        .then(result => {
          res.status(204).end()
        })
        .catch(error => next(error))
  })

  app.post('/api/persons', (req, res, next) => {
      const body = req.body
      console.log(req.body)
      


      // if(persons.some(person => person.name === body.name)) {
      //     return res.status(400).json({
      //         error: 'person with same name already saved'
      //     })
      // }

      const person = new Person ({
          name: body.name,
          number: body.number
      })

      person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number,
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
      .then(updatedPerson => {
        res.json(updatedPerson.toJSON())
      })
      .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  // olemattomien osoitteiden käsittely
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError' && error.kind == 'ObjectId') {
      return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({error: error.message})
    } // else if (error.name === 'createError') {
    //   return response.status(404).json({error: error.message})
    // } // serveriltä poistetun postaminen?
  
    next(error)
  }
  
  app.use(errorHandler)
    
  const PORT = process.env.PORT
  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })

